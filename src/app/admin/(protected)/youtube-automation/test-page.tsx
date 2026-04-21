'use client';

export default function YouTubeAutomationTestPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">YouTube Automation Test Page</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <strong>Success!</strong> YouTube automation page is working.
      </div>
      <div className="mt-4">
        <p>If you can see this page, the routing is working correctly.</p>
        <p>The main page.tsx might have import errors or missing components.</p>
      </div>
    </div>
  );
}
