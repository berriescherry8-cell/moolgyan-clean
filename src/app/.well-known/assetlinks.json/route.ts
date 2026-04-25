import { NextResponse } from 'next/server';

export async function GET() {
  const assetlinks = [
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.moolgyan.app",
        "sha256_cert_fingerprints": [
          "2B:F6:59:EE:B3:CF:26:DB:55:24:7F:6D:23:BB:CF:52:5C:F4:27:F3:90:02:01:25:DC:02:F4:49:07:E0:BF:BC",
          "4E:68:10:2C:97:00:E7:93:8B:9C:D0:0F:D2:9C:8D:EF:1F:C1:B3:1C:85:12:F6:65:82:F2:77:C9:21:19:72:FD"
        ]
      }
    }
  ];

  return NextResponse.json(assetlinks);
}

export const dynamic = 'force-static';
