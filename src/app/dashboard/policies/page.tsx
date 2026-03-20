'use client';

import React from 'react';
import Policies from '@/components/dashboard/Policies';

export default function PoliciesPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="p-8">
        <Policies />
      </div>
    </div>
  );
}
