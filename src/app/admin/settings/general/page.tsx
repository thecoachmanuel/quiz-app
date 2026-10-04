"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminGeneralSettingsPage() {
  const { settings, updateSettings } = useSiteSettingsStore();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: settings.site_name,
    company_email: settings.company_email,
    company_phone: settings.company_phone,
    website: settings.website,
    timezone: settings.timezone,
    currency: settings.currency,
    currency_symbol: settings.currency_symbol,
    frontend_url: settings.website,
    address_country: settings.address_country,
    address_city: settings.address_city,
    address_line: settings.address_line,
  });

  // Sync from store on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      site_name: settings.site_name,
      company_email: settings.company_email,
      company_phone: settings.company_phone,
      website: settings.website,
      timezone: settings.timezone,
      currency: settings.currency,
      currency_symbol: settings.currency_symbol,
      frontend_url: settings.website,
      address_country: settings.address_country,
      address_city: settings.address_city,
      address_line: settings.address_line,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      // Persist to shared store so main site reflects changes
      updateSettings({
        site_name: formData.site_name,
        company_email: formData.company_email,
        company_phone: formData.company_phone,
        website: formData.website,
        timezone: formData.timezone,
        currency: formData.currency,
        currency_symbol: formData.currency_symbol,
        address_country: formData.address_country,
        address_city: formData.address_city,
        address_line: formData.address_line,
      });
      setSaving(false);
      toast.success("General settings saved successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="General Settings" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Company & Brand Info */}
        <div className="admin-white-box p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
            Brand & Company Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Platform Name</label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
            <div>
              <label className="admin-form-label">Support Email</label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
            <div>
              <label className="admin-form-label">Support Phone</label>
              <input
                type="text"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
            <div>
              <label className="admin-form-label">Official Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
          </div>
        </div>

        {/* Localization & Currency */}
        <div className="admin-white-box p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
            Localization & Currency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-form-label">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="admin-form-control"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              </select>
            </div>

            <div>
              <label className="admin-form-label">Default Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="admin-form-control"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="admin-form-label">Currency Symbol</label>
              <input
                type="text"
                name="currency_symbol"
                value={formData.currency_symbol}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="admin-white-box p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
            Physical Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Country</label>
              <input
                type="text"
                name="address_country"
                value={formData.address_country}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
            <div>
              <label className="admin-form-label">City</label>
              <input
                type="text"
                name="address_city"
                value={formData.address_city}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
            <div className="col-span-full">
              <label className="admin-form-label">Street Address</label>
              <input
                type="text"
                name="address_line"
                value={formData.address_line}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            {saving && <i className="ph ph-spinner animate-spin"></i>}
            {saving ? "Saving Settings..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
