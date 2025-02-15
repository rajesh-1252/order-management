
'use server'
import db from '../db'

export async function getProducts() {
  try {
    const result = await db.products.findMany()
    return { success: true, message: "Products fetched succesfully", data: result };
  } catch {
    return { success: false, message: "Faild to fetch products", data: [] };
  }
}




export async function CreateOrder({
  orderDescription,
  productIds,
}: {
  orderDescription: string;
  productIds: number[];
}) {
  try {
    const result = await db.orders.create({
      data: {
        orderDescription,
        createdAt: new Date(),
        OrderProductMaps: {
          create: productIds.map((productId) => ({
            productId,
          })),
        },
      },
      include: {
        OrderProductMaps: true,
      },
    });

    return {
      success: true,
      message: "Order created successfully with products",
      data: result,
    };
  } catch {
    return {
      success: false,
      message: "Failed to create order with products",
      data: [],
    };
  }
}


export async function getOrders({ page = 1, limit = 10, search = "" }) {
  try {
    const skip = (page - 1) * limit;
    const where = search
      ? {
        OR: [
          { id: !isNaN(Number(search)) ? Number(search) : undefined },
          { orderDescription: { contains: search, mode: 'insensitive' as const } }
        ].filter(Boolean)
      }
      : {};

    const [orders, total] = await Promise.all([
      db.orders.findMany({ skip, take: limit, where, orderBy: { createdAt: 'desc' }, include: { OrderProductMaps: true } }),
      db.orders.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { success: true, data: { orders, totalPages } };
  } catch {
    return { success: false, message: 'Failed to fetch orders' };
  }
}


export async function getOrderById(id: number) {
  try {
    const order = await db.orders.findFirst({
      where: { id },
      include: {
        OrderProductMaps: true,
      },
    });

    return {
      success: true,
      data: order,
    };
  } catch {
    return {
      success: false,
      message: 'Failed to fetch order',
    };
  }
}



export async function editOrder({
  id,
  orderDescription,
  productIds,
}: {
  id: number;
  orderDescription: string;
  productIds: number[];
}) {
  try {
    const updatedOrder = await db.orders.update({
      where: { id },
      data: {
        orderDescription,
        OrderProductMaps: {
          deleteMany: {},
          create: productIds.map((productId) => ({
            productId,
          })),
        },
      },
    });

    return {
      success: true,
      data: updatedOrder,
    };
  } catch {
    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}


export async function deleteOrder({ id }: { id: number }) {
  try {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const deletedOrder = await db.orders.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedOrder,
    };
  } catch {
    return {
      success: false,
      data: [],
    };
  }
}

