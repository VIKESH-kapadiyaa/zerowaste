-- ZeroWaste Supabase Database Initialization Script

-- 1. Create Profiles Table (Stores Donor/Collector Business Details)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'donor',
  business_name TEXT,
  entity_type TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Secure the Profiles Table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Create Listings Table (Stores active and historical Food Donations)
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  qty TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'high',
  tags JSONB DEFAULT '[]'::jsonb,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Secure the Listings Table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings are viewable by everyone." ON public.listings FOR SELECT USING (true);
CREATE POLICY "Donors can insert their own listings." ON public.listings FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Anyone can update a listing (Collectors claiming it)." ON public.listings FOR UPDATE USING (true);


-- 3. Create Claims Table (The permanent Activity Log of what was taken)
CREATE TABLE public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  collector_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Secure the Claims Table
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Claims are viewable by everyone." ON public.claims FOR SELECT USING (true);
CREATE POLICY "Collectors can insert their own claims." ON public.claims FOR INSERT WITH CHECK (auth.uid() = collector_id);
