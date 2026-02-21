-- ============================================================
-- Yazzil Enterprise Clients — Exact CSV Seed
-- Generated from yazzil_enterprise.csv
-- 7 clients, 91 transactions, $7,250.00 total
-- Run in Neon SQL editor
-- ============================================================

-- Step 1: Seed Users (7 enterprise clients)
INSERT INTO "User" (
  id, "clerkId", email, "firstName", "lastName",
  role, "subscriptionTier", "subscriptionStatus",
  "businessName", "businessIndustry", "businessType",
  "contractValue", "contractStartDate", "mrr",
  "aiEnabled", "aiTone", "createdAt", "updatedAt"
) VALUES
(
  'client_apex_001', 'clerk_apex_001', 'contact@apexdigital.com',
  'James', 'Okafor',
  'USER', 'enterprise', 'active',
  'Apex Digital Ltd', 'Digital Marketing', 'Agency',
  133.6, '2025-01-06', 133.6,
  true, 'professional',
  '2025-01-06 09:00:00', NOW()
),
(
  'client_nouri_002', 'clerk_nouri_002', 'hello@nouriandco.com',
  'Nouri', 'Hassan',
  'USER', 'enterprise', 'active',
  'Nouri & Co', 'E-commerce', 'Retail',
  106.31, '2025-01-04', 106.31,
  true, 'professional',
  '2025-01-04 09:00:00', NOW()
),
(
  'client_bluewave_003', 'clerk_bluewave_003', 'info@bluewavesolutions.com',
  'Sarah', 'Mitchell',
  'USER', 'enterprise', 'active',
  'Bluewave Solutions', 'Technology', 'Agency',
  93.19, '2025-01-02', 93.19,
  true, 'professional',
  '2025-01-02 09:00:00', NOW()
),
(
  'client_kestrel_004', 'clerk_kestrel_004', 'team@kestrelmedia.com',
  'David', 'Kestrel',
  'USER', 'enterprise', 'active',
  'Kestrel Media', 'Media', 'Agency',
  74.2, '2025-01-09', 74.2,
  true, 'professional',
  '2025-01-09 09:00:00', NOW()
),
(
  'client_thornfield_005', 'clerk_thornfield_005', 'admin@thornfieldinc.com',
  'Claire', 'Thornfield',
  'USER', 'enterprise', 'active',
  'Thornfield Inc', 'Professional Svcs', 'Corporate',
  62.69, '2025-01-04', 62.69,
  true, 'professional',
  '2025-01-04 09:00:00', NOW()
),
(
  'client_mara_006', 'clerk_mara_006', 'mara@maraconsulting.com',
  'Mara', 'Osei',
  'USER', 'enterprise', 'active',
  'Mara Consulting', 'Consulting', 'Boutique',
  48.16, '2025-01-11', 48.16,
  true, 'professional',
  '2025-01-11 09:00:00', NOW()
),
(
  'client_zuri_007', 'clerk_zuri_007', 'hello@zuriretail.com',
  'Zuri', 'Abara',
  'USER', 'enterprise', 'active',
  'Zuri Retail Group', 'Retail', 'Retail',
  39.54, '2025-01-01', 39.54,
  true, 'professional',
  '2025-01-01 09:00:00', NOW()
);

-- Step 2: Seed SalesUploadItems (91 exact transactions from CSV)
-- First create a SalesUpload batch record
INSERT INTO "SalesUpload" (id, "fileName", status, "rowCount", notes, "uploadedAt")
VALUES ('upload_enterprise_001', 'yazzil_enterprise.csv', 'completed', 91, 'Enterprise client seed — 7 clients, Jan 2025–Jan 2026', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SalesUploadItem" (
  id, "uploadId", date, amount, product, customer, description, currency, quantity
) VALUES
(
  'item_ent_001', 'upload_enterprise_001',
  '2025-01-06', 119.16,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_002', 'upload_enterprise_001',
  '2025-02-01', 127.87,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_003', 'upload_enterprise_001',
  '2025-03-04', 117.87,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_004', 'upload_enterprise_001',
  '2025-04-12', 131.35,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_005', 'upload_enterprise_001',
  '2025-05-02', 144.86,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_006', 'upload_enterprise_001',
  '2025-06-13', 140.02,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_007', 'upload_enterprise_001',
  '2025-07-12', 150.42,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_008', 'upload_enterprise_001',
  '2025-08-07', 148.67,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_009', 'upload_enterprise_001',
  '2025-09-07', 117.97,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_010', 'upload_enterprise_001',
  '2025-10-09', 126.14,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_011', 'upload_enterprise_001',
  '2025-11-05', 143.20,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_012', 'upload_enterprise_001',
  '2025-12-13', 152.21,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_013', 'upload_enterprise_001',
  '2026-01-14', 117.10,
  'Enterprise Plan', 'Apex Digital Ltd',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_014', 'upload_enterprise_001',
  '2025-01-02', 87.53,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_015', 'upload_enterprise_001',
  '2025-02-14', 70.13,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_016', 'upload_enterprise_001',
  '2025-03-04', 70.68,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_017', 'upload_enterprise_001',
  '2025-04-08', 73.89,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_018', 'upload_enterprise_001',
  '2025-05-14', 76.24,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_019', 'upload_enterprise_001',
  '2025-06-01', 109.07,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_020', 'upload_enterprise_001',
  '2025-07-12', 94.82,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_021', 'upload_enterprise_001',
  '2025-08-03', 107.55,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_022', 'upload_enterprise_001',
  '2025-09-03', 112.40,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_023', 'upload_enterprise_001',
  '2025-10-10', 108.42,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_024', 'upload_enterprise_001',
  '2025-11-08', 86.81,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_025', 'upload_enterprise_001',
  '2025-12-07', 120.16,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_026', 'upload_enterprise_001',
  '2026-01-02', 93.77,
  'Enterprise Plan', 'Bluewave Solutions',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_027', 'upload_enterprise_001',
  '2025-01-09', 56.26,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_028', 'upload_enterprise_001',
  '2025-02-14', 56.97,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_029', 'upload_enterprise_001',
  '2025-03-15', 74.99,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_030', 'upload_enterprise_001',
  '2025-04-15', 81.09,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_031', 'upload_enterprise_001',
  '2025-05-07', 82.41,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_032', 'upload_enterprise_001',
  '2025-06-11', 63.25,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_033', 'upload_enterprise_001',
  '2025-07-03', 82.64,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_034', 'upload_enterprise_001',
  '2025-08-13', 87.28,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_035', 'upload_enterprise_001',
  '2025-09-04', 73.27,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_036', 'upload_enterprise_001',
  '2025-10-09', 80.05,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_037', 'upload_enterprise_001',
  '2025-11-01', 71.23,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_038', 'upload_enterprise_001',
  '2025-12-15', 79.05,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_039', 'upload_enterprise_001',
  '2026-01-06', 76.05,
  'Enterprise Plan', 'Kestrel Media',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_040', 'upload_enterprise_001',
  '2025-01-11', 31.29,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_041', 'upload_enterprise_001',
  '2025-02-02', 38.48,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_042', 'upload_enterprise_001',
  '2025-03-02', 46.29,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_043', 'upload_enterprise_001',
  '2025-04-05', 59.50,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_044', 'upload_enterprise_001',
  '2025-05-04', 49.49,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_045', 'upload_enterprise_001',
  '2025-06-07', 57.15,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_046', 'upload_enterprise_001',
  '2025-07-08', 38.04,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_047', 'upload_enterprise_001',
  '2025-08-02', 38.77,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_048', 'upload_enterprise_001',
  '2025-09-03', 43.88,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_049', 'upload_enterprise_001',
  '2025-10-08', 64.42,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_050', 'upload_enterprise_001',
  '2025-11-15', 43.90,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_051', 'upload_enterprise_001',
  '2025-12-07', 64.55,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_052', 'upload_enterprise_001',
  '2026-01-06', 50.27,
  'Enterprise Plan', 'Mara Consulting',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_053', 'upload_enterprise_001',
  '2025-01-04', 76.53,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_054', 'upload_enterprise_001',
  '2025-02-08', 105.91,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_055', 'upload_enterprise_001',
  '2025-03-02', 87.02,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_056', 'upload_enterprise_001',
  '2025-04-02', 94.07,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_057', 'upload_enterprise_001',
  '2025-05-09', 99.12,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_058', 'upload_enterprise_001',
  '2025-06-01', 119.38,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_059', 'upload_enterprise_001',
  '2025-07-11', 109.56,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_060', 'upload_enterprise_001',
  '2025-08-01', 114.93,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_061', 'upload_enterprise_001',
  '2025-09-02', 132.12,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_062', 'upload_enterprise_001',
  '2025-10-10', 126.46,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_063', 'upload_enterprise_001',
  '2025-11-04', 116.60,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_064', 'upload_enterprise_001',
  '2025-12-02', 117.62,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_065', 'upload_enterprise_001',
  '2026-01-14', 82.75,
  'Enterprise Plan', 'Nouri & Co',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_066', 'upload_enterprise_001',
  '2025-01-04', 63.24,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_067', 'upload_enterprise_001',
  '2025-02-06', 51.42,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_068', 'upload_enterprise_001',
  '2025-03-12', 55.04,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_069', 'upload_enterprise_001',
  '2025-04-09', 65.23,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_070', 'upload_enterprise_001',
  '2025-05-10', 66.92,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_071', 'upload_enterprise_001',
  '2025-06-06', 51.44,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_072', 'upload_enterprise_001',
  '2025-07-02', 58.95,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_073', 'upload_enterprise_001',
  '2025-08-12', 74.92,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_074', 'upload_enterprise_001',
  '2025-09-02', 72.90,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_075', 'upload_enterprise_001',
  '2025-10-14', 61.86,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_076', 'upload_enterprise_001',
  '2025-11-01', 74.44,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_077', 'upload_enterprise_001',
  '2025-12-12', 69.65,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_078', 'upload_enterprise_001',
  '2026-01-04', 49.02,
  'Enterprise Plan', 'Thornfield Inc',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_079', 'upload_enterprise_001',
  '2025-01-01', 36.19,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_080', 'upload_enterprise_001',
  '2025-02-05', 35.91,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_081', 'upload_enterprise_001',
  '2025-03-12', 43.33,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_082', 'upload_enterprise_001',
  '2025-04-13', 36.50,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_083', 'upload_enterprise_001',
  '2025-05-07', 40.67,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_084', 'upload_enterprise_001',
  '2025-06-09', 32.62,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_085', 'upload_enterprise_001',
  '2025-07-15', 49.57,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_086', 'upload_enterprise_001',
  '2025-08-08', 45.31,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_087', 'upload_enterprise_001',
  '2025-09-14', 33.09,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_088', 'upload_enterprise_001',
  '2025-10-05', 45.97,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_089', 'upload_enterprise_001',
  '2025-11-04', 36.37,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_090', 'upload_enterprise_001',
  '2025-12-14', 38.87,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
),
(
  'item_ent_091', 'upload_enterprise_001',
  '2026-01-11', 39.62,
  'Enterprise Plan', 'Zuri Retail Group',
  'Enterprise plan — monthly retainer', 'USD', 1
);