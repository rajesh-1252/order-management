"use client";

import OrderForm from '@/components/custom/OrderForm';
import { use } from 'react';


const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);

  return (
    <div className='flex h-screen justify-center items-center'>
      <OrderForm id={resolvedParams.id} />
    </div>
  );
};

export default Page;


