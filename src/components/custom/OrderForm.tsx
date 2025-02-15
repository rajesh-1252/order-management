"use client";
import { CreateOrder, editOrder, getOrderById, getProducts } from '@/action/action';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const OrderForm = ({ id }: { id: string }) => {
  const orderId = Number(id);
  const router = useRouter();

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [productError, setProductError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, orderRes] = await Promise.all([
          getProducts(),
          orderId ? getOrderById(orderId) : null,
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
        } else {
          throw new Error('Failed to load products');
        }

        if (orderRes && orderRes.success && orderRes.data) {
          setDescription(orderRes.data.orderDescription);
          setSelectedProductIds(orderRes.data.OrderProductMaps.map((item) => item.productId));
        }
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleToggle = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    let isValid = true;
    if (!description.trim()) {
      setDescriptionError('Order description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (selectedProductIds.length === 0) {
      setProductError('Select at least one product');
      isValid = false;
    } else {
      setProductError('');
    }

    if (!isValid) return;

    try {
      setLoading(true);
      let response;
      if (orderId) {
        response = await editOrder({
          id: orderId,
          orderDescription: description,
          productIds: selectedProductIds,
        });
      } else {
        response = await CreateOrder({
          orderDescription: description,
          productIds: selectedProductIds,
        });
      }
      setLoading(false);

      if (response.success) {
        router.push('/order');
      }
    } catch {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg shadow-md w-96 mx-auto relative">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ShoppingCart className="h-6 w-6 text-blue-500" />
        <span className="text-blue-500 font-bold">{selectedProductIds.length}</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">{orderId ? 'Edit Order' : 'New Order'}</h2>

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Order Description"
        className={`border w-full mb-2 p-2 rounded ${descriptionError ? 'border-red-500' : ''}`}
      />
      {descriptionError && <p className="text-red-500 text-sm mb-2">{descriptionError}</p>}

      <div>
        {products.map((item) => (
          <div onClick={() => handleToggle(item.id)} key={item.id} className="flex items-start mb-2 border p-2 rounded cursor-pointer hover:bg-gray-100 transition">
            <input
              type="checkbox"
              checked={selectedProductIds.includes(item.id)}
              className="mt-1"
              readOnly
            />
            <div className="ml-2">
              <div className="font-bold text-green-700">{item.productName}</div>
              <div className="text-sm text-gray-500">This is {item.productName}</div>
            </div>
          </div>
        ))}
        {productError && <p className="text-red-500 text-sm mb-2">{productError}</p>}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={handleCancel} className="bg-red-200 text-red-800 font-bold py-2 px-4 rounded">
          Cancel
        </button>
        <button onClick={handleSubmit} className="bg-gray-300 text-black font-bold py-2 px-4 rounded">
          {orderId ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
