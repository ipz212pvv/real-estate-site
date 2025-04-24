import { useMemo, useState } from "react";
import { Button, Form, message, Popconfirm, Space, Typography } from "antd";
import { FaTrash } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";

import { DataTable } from "@/components/common/DataTable/DataTable.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { EditPropertyTypeModal } from "@/components/EditPropertyTypeModal/EditPropertyTypeModal.jsx";

import {
  useDeleteAdvertPropertyTypeMutation,
  useGetAdvertPropertyTypesQuery
} from "@/store/services/advert-property-types.js";

export function AdminPropertyTypes() {
  const { data: types, isLoading } = useGetAdvertPropertyTypesQuery();
  const [deletePropertyType, { isLoading: isDeleting }] = useDeleteAdvertPropertyTypeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    deletePropertyType(id)
      .unwrap()
      .then(() => message.success('Вид нерухомості успішно видалено'))
      .catch(error => message.error(error.message))
  };

  const handleOpenModal = (data) => {
    setEditId(data.id);
    form.setFieldsValue({
      name: data.name,
      description: data.description,
    });
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: "ID",
      },
      {
        accessorKey: 'name',
        header: "Назва",
      },
      {
        accessorKey: 'description',
        header: "Опис",
      },
      {
        header: " ",
        cell: data => (
          <Space size="small">
            <Button
              title="Редагувати"
              icon={<LuPencil />}
              onClick={() => handleOpenModal(data.row.original)}
            />
            <Popconfirm
              title="Видалити вид нерухомості"
              description="Ви дійсно бажаєте видалити цей вид нерухомості?"
              onConfirm={() => handleDelete(data.row.original.id)}
              disabled={isDeleting}
            >
              <Button
                title="Видалити"
                type="primary"
                icon={<FaTrash/>}
                loading={isDeleting}
                danger
              />
            </Popconfirm>
          </Space>
        )
      },
    ],
    []
  )

  if (isLoading) return <Loading />;

  return (
    <>
      <Typography.Title level={3}>Види нерухомості</Typography.Title>

      <DataTable data={types} columns={columns} />

      <EditPropertyTypeModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        form={form}
        propertyTypeId={editId}
      />
    </>
  )
}