from supabase import create_client

url = "https://zbjltqntapedqzxeuflz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpiamx0cW50YXBlZHF6eGV1Zmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzY2NDksImV4cCI6MjA4ODM1MjY0OX0.9xSaJH0wFeSjuSwzjo5-RsmI4CIlairUXlFZJJ-_8lw"

supabase = create_client(url, key)
res = supabase.from_('spiritualPhotos').select('*').execute()
print(res)
print("Total rows:", len(res.data) if res.data else 0)
for row in (res.data or []):
    print(row['id'], row.get('folder'), row.get('imageUrl'))
