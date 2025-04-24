import { useMemo, useState } from "react";
import { Button, Flex, message, Popconfirm, Space, Typography } from "antd";
import { FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

import { DataTable } from "@/components/common/DataTable/DataTable.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { ViewComplaintModal } from "@/components/ViewComplaintModal/ViewComplaintModal.jsx";

import {
  useDeleteComplaintMutation,
  useGetComplaintsQuery
} from "@/store/services/complaints.js";
import { Link } from "react-router";

export function AdminComplaints() {
  const { data: complaints, isLoading } = useGetComplaintsQuery();
  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleDelete = (id) => {
    deleteComplaint(id)
      .unwrap()
      .then(() => message.success('Скаргу успішно видалено'))
      .catch(error => message.error(error.message))
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: "ID",
      },
      {
        accessorKey: 'complaintUser',
        header: "Користувач",
        cell: data => {
          const { id, name, surname } = data.row.original.complaintUser;
          return <Link to={`/accounts/${id}`}>{name} {surname}</Link>;
        }
      },
      {
        accessorKey: 'complaintAdvert',
        header: "Оголошення",
        cell: data => {
          const { id, title } = data.row.original.complaintAdvert;
          return <Link to={`/adverts/${id}`}>{title}</Link>;
        }
      },
      {
        accessorKey: 'createdAt',
        header: "Дата",
        cell: data => formatDate(data.row.original.createdAt)
      },
      {
        header: " ",
        cell: data => (
          <Space size="small">
            <Button
              title="Переглянути"
              icon={<FaEye />}
              onClick={() => handleOpenModal(data.row.original)}
            />
            <Popconfirm
              title="Видалити скаргу"
              description="Ви дійсно бажаєте видалити цю скаргу?"
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
        <Typography.Title style={{ margin: 0 }} level={3}>Скарги</Typography.Title>
      </Flex>

      <DataTable data={complaints} columns={columns} />

      <ViewComplaintModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        complaint={selectedComplaint}
      />
    </>
  )
}