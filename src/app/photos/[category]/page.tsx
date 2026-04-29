import CategoryPageClient from './CategoryPageClient';

const CATEGORY_NAMES: Record<string, string> = {
  general: 'General Gallery',
  prachar: 'Prachar aur Prasar',
  'saar-sangrah': 'Saar Sangrah',
  videsh: 'Videsh Bhraman',
  events: 'Events',
  satsang: 'Satsang',
  deeksha: 'Deeksha',
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_NAMES).map((category) => ({
    category,
  }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const displayName = CATEGORY_NAMES[category] || category;

  return <CategoryPageClient category={category} displayName={displayName} />;
}

