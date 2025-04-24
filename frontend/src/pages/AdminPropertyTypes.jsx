import { useMemo, useState } from "react";
import { Button, Flex, Form, message, Popconfirm, Space, Typography } from "antd";
import { FaTrash, FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";

import { DataTable } from "@/components/common/DataTable/DataTable.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { EditPropertyTypeModal } from "@/components/EditPropertyTypeModal/EditPropertyTypeModal.jsx";

import {
  useDeleteAdvertPropertyTypeMutation,
  useGetAdvertPropertyTypesQuery
} from "@/store/services/advert-property-types.js";

export default function AdminPropertyTypes() {
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
    if (data) {
      setEditId(data.id);
      form.setFieldsValue({
        name: data.name,
        description: data.description,
      });
    } else {
      setEditId(null);
      form.resetFields();
    }
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
      <Flex style={{ margin: 16 }} justify="space-between" align="center">
        <Typography.Title style={{ margin: 0 }} level={3}>Види нерухомості</Typography.Title>

        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal(null)}
        >
          Додати вид нерухомості
        </Button>
      </Flex>

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
