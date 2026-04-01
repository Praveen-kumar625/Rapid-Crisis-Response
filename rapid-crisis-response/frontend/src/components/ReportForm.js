import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import {
  queueReport,
  getPendingReports,
  markReportSynced,
} from '../idb';

function ReportForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 3,
    category: '',
  });
  const [position, setPosition] = useState({ lng: 0, lat: 0 });

  // ---------------------------------------------------------
  // Sync any pending reports when we regain a network connection
  // ---------------------------------------------------------
  useEffect(() => {
    async function syncPending() {
      const pending = await getPendingReports();
      if (!pending.length) return;

      for (const rpt of pending) {
        try {
          await api.post('/incidents', {
            title: rpt.title,
            description: rpt.description,
            severity: rpt.severity,
            category: rpt.category,
            lng: rpt.lng,
            lat: rpt.lat,
          });
          await markReportSynced(rpt.localId);
          toast.success(`✅ Offline report "${rpt.title}" synced`);
        } catch (err) {
          console.error('⛔ Failed to sync pending report', err);
          // keep it in the queue for the next attempt
        }
      }
    }

    if (navigator.onLine) {
      syncPending();
    }

    window.addEventListener('online', syncPending);
    return () => window.removeEventListener('online', syncPending);
  }, []);

  // ---------------------------------------------------------
  // Submit handler – online vs. offline
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      lng: position.lng,
      lat: position.lat,
    };

    if (navigator.onLine) {
      // Online – send straight to the API
      try {
        await api.post('/incidents', payload);
        toast.success('✅ Incident reported');
      } catch (err) {
        console.error(err);
        toast.error('❌ Failed to report incident');
      }
    } else {
      // Offline – queue it in IndexedDB
      await queueReport(payload);
      toast.success('🌓 Offline: report queued – it will sync when you go online');
    }
  };

  // ---------------------------------------------------------
  // UI – unchanged except we reference `handleSubmit`
  // ---------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full p-2 border"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="w-full p-2 border"
        placeholder="Description"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <select
        className="w-full p-2 border"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Category</option>
        <option>FLOOD</option>
        <option>EARTHQUAKE</option>
        <option>FIRE</option>
        <option>PANDEMIC</option>
      </select>

      <label className="block">
        Severity: {form.severity}
        <input
          type="range"
          min={1}
          max={5}
          value={form.severity}
          onChange={(e) =>
            setForm({ ...form, severity: Number(e.target.value) })
          }
          className="w-full"
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Incident
      </button>
    </form>
  );
}

export default ReportForm;
