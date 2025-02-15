"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteOrder, getOrders } from "@/action/action";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const OrderManagementTable = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrdersTypes[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const result = await getOrders({ page, search: debouncedSearch });
      if (result.success && result.data) {
        setOrders(result.data.orders ?? []);
        setTotalPages(result.data.totalPages);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch orders.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    }
  }, [page, debouncedSearch, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page]);

  const handleEdit = (id: number) => router.push(`/order/${id}`);
  const handleDelete = async (id: number) => {
    try {
      const deletedOrder = await deleteOrder({ id });
      if (!deletedOrder.success) {
        toast({ title: "Error", description: "Failed to delete order.", variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Order deleted successfully." });
      await fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error deleting order.", variant: "destructive" });
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <Toaster />
      <div className="flex justify-between gap-10">
        <input
          type="text"
          placeholder="Search by Order ID or Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border border-cyan-400 rounded"
        />
        <Button size={'lg'} className="py-4" onClick={() => router.push("/order/new")}>New order</Button>
      </div>
      <div className="overflow-x-auto h-[500px]">
        <Table className="min-w-full border border-cyan-400 rounded-l">
          <TableHeader className="bg-gray-500">
            <TableRow className="text-white">
              <TableHead className="w-[100px] text-white">Order Id</TableHead>
              <TableHead className="text-white">Order Description</TableHead>
              <TableHead className="text-white">Products</TableHead>
              <TableHead className="text-right text-white">Created Date</TableHead>
              <TableHead className="text-right text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.orderDescription}</TableCell>
                <TableCell>{order.OrderProductMaps.length}</TableCell>
                <TableCell className="text-right">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(order.id)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
};

export default OrderManagementTable;
