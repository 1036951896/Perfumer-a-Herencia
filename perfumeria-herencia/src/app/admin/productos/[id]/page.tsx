import { EditarProductoForm } from '@/components/admin/EditarProductoForm';

export default function EditarProductoPage({ params }: { params: { id: string } }) {
  return <EditarProductoForm id={params.id} />;
}