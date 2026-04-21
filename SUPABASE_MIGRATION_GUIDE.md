# Supabase Migration Guide for Mool Gyan App

This guide will help you migrate from GitHub RAW URLs to Supabase for your book management system.

## 🚀 Quick Start

### 1. Set up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to the SQL Editor
3. Run the SQL from `supabase-books-table.sql` to create the books table
4. Enable Row Level Security (RLS) policies as specified in the SQL file

### 2. Update Environment Variables

Ensure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lqymwrhfirszrakuevqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA
```

### 3. Test the Implementation

1. Start your development server: `npm run dev`
2. Visit `/books` to see the updated books page
3. Visit `/admin/books` to see the admin interface
4. Check the browser console for any errors

## 📋 What Changed

### Frontend Changes

#### `src/app/books/page.tsx`
- ✅ Replaced hardcoded books array with Supabase data fetching
- ✅ Added loading states and error handling
- ✅ Updated property names to match Supabase table schema (snake_case)
- ✅ Added toast notifications for user feedback

#### `src/app/admin/books/page.tsx`
- ✅ Replaced dataManager with Supabase client
- ✅ Added CRUD operations (Create, Read, Update, Delete)
- ✅ Implemented proper error handling
- ✅ Added file upload functionality (placeholder)

### Database Schema

The new Supabase table structure:

```sql
books table:
- id (UUID, primary key)
- title (TEXT, required)
- author (TEXT, required)
- price (DECIMAL, required)
- description (TEXT, optional)
- cover_url (TEXT, required) - Supabase storage URLs
- pdf_url (TEXT, optional) - Supabase storage URLs
- stock_status (TEXT, enum: 'in-stock', 'out-of-stock', 'read-only')
- category (TEXT, optional)
- alt_text (TEXT, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔄 Migration Steps

### Step 1: Database Setup
1. Create the books table using the SQL provided
2. Insert your existing book data
3. Set up RLS policies for security

### Step 2: File Migration
1. Upload your book covers and PDFs to Supabase Storage
2. Update the `cover_url` and `pdf_url` fields with the new Supabase storage URLs
3. Organize files in appropriate buckets (e.g., `book-covers`, `book-pdfs`)

### Step 3: Testing
1. Verify books load correctly on the frontend
2. Test admin CRUD operations
3. Check error handling and loading states
4. Ensure PDF downloads work properly

## 🛠️ File Upload Integration

To fully integrate file uploads with Supabase Storage:

1. Create storage buckets in Supabase:
   - `book-covers` for book cover images
   - `book-pdfs` for PDF files

2. Update the upload functions in admin pages to use Supabase Storage API

3. Set up storage policies for authenticated uploads

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Supabase project allows your domain
2. **RLS Errors**: Check that your RLS policies are correctly configured
3. **Loading Issues**: Verify your Supabase credentials are correct
4. **File Upload**: Make sure storage buckets are created and policies are set

### Debug Tips

1. Check browser console for JavaScript errors
2. Use Supabase dashboard to verify data
3. Test API calls directly in Supabase SQL Editor
4. Monitor network requests in browser dev tools

## 📁 Files Modified

- ✅ `src/app/books/page.tsx` - Updated to use Supabase
- ✅ `src/app/admin/books/page.tsx` - Updated to use Supabase
- 📄 `supabase-books-table.sql` - Database schema
- 📄 `SUPABASE_MIGRATION_GUIDE.md` - This guide

## 🎯 Next Steps

1. **Complete File Upload**: Implement proper Supabase Storage integration
2. **Add Authentication**: Set up Supabase Auth for admin access
3. **Optimize Performance**: Add caching and pagination
4. **Enhance UI**: Improve admin interface with better forms
5. **Add Validation**: Implement form validation and data sanitization

## 📞 Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the browser console for errors
3. Verify your database schema matches the expected structure
4. Ensure all environment variables are correctly set

## 🎉 Benefits of Migration

- ✅ **Better Performance**: Faster loading with optimized queries
- ✅ **Scalability**: Handle more books and users easily
- ✅ **Security**: Proper authentication and authorization
- ✅ **Maintenance**: Easier to manage and update content
- ✅ **Reliability**: More stable than GitHub RAW URLs
- ✅ **Features**: Rich querying and real-time capabilities