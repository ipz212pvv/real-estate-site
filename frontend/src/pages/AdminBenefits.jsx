import { useMemo, useState } from "react";
import { Button, Flex, Form, message, Popconfirm, Space, Typography } from "antd";
import { FaTrash, FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";

import { DataTable } from "@/components/common/DataTable/DataTable.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { EditBenefitModal } from "@/components/EditBenefitModal/EditBenefitModal.jsx";

import {
  useDeleteBenefitMutation,
  useGetBenefitsQuery
} from "@/store/services/benefits.js";

export default function AdminBenefits() {
  const { data: benefits, isLoading } = useGetBenefitsQuery();
  const [deleteBenefit, { isLoading: isDeleting }] = useDeleteBenefitMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    deleteBenefit(id)
      .unwrap()
      .then(() => message.success('Перевагу успішно видалено'))
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
              title="Видалити перевагу"
              description="Ви дійсно бажаєте видалити цю перевагу?"
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
        <Typography.Title style={{ margin: 0 }} level={3}>Переваги</Typography.Title>

        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal(null)}
        >
          Додати перевагу
        </Button>
      </Flex>

      <DataTable data={benefits} columns={columns} />

      <EditBenefitModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        form={form}
        benefitId={editId}
      />
    </>
  )
}
