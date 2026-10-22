import React from 'react';
import { Badge } from '../common/Badge';

export const OrderStatusBadge = ({ status }) => {
  const getVariant = (st) => {
    switch (st) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'purple';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Badge variant={getVariant(status)} dot>
      {status}
    </Badge>
  );
};

export const PaymentStatusBadge = ({ status }) => {
  const getVariant = (st) => {
    switch (st) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Refunded':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return <Badge variant={getVariant(status)}>{status}</Badge>;
};
