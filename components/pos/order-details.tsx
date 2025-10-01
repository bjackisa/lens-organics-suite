import { Badge } from "@/components/ui/badge"
import type { SalesOrder } from "@/lib/types"
import { format } from "date-fns"
import { Calendar, DollarSign, Package, User, Phone, Mail } from "lucide-react"

interface OrderDetailsProps {
  order: SalesOrder
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "partial":
        return "secondary"
      case "unpaid":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Customer Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            {order.customer_email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{order.customer_email}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.customer_phone}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Order Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{order.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Product Details</h4>
        <div className="rounded-lg border p-4">
          <p className="font-medium">{order.product_description}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Quantity: {order.quantity}</span>
            <span>Unit Price: UGX {order.unit_price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Payment Details</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Payment Method:</span>
            <span className="font-medium capitalize">{order.payment_method || "Not specified"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Status:</span>
            <Badge variant={getPaymentStatusColor(order.payment_status)} className="capitalize">
              {order.payment_status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Order Status:</span>
            <Badge variant={getStatusColor(order.order_status)} className="capitalize">
              {order.order_status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Total Amount:</span>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">UGX {order.total_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Notes</h4>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
