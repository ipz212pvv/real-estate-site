import { useMemo, useState } from "react";
import { Link } from "react-router";
import { LuEye, LuPencil } from "react-icons/lu";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { Typography, Space, Button, Popconfirm, message, Form } from "antd";
import { green, red } from "@ant-design/colors";

import { Loading } from "@/components/common/Loading/Loading.jsx";
import { DataTable } from "@/components/common/DataTable/DataTable.jsx";
import { EditUserModal } from "@/components/EditUserModal/EditUserModal.jsx";

import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/store/services/users.js";
import { useGetUserTypesQuery } from "@/store/services/userTypes.js";

export function AdminUsers() {
  const { data: users, isLoading } = useGetUsersQuery();
  const { data: types = [], isLoading: isLoadingTypes } = useGetUserTypesQuery();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    deleteUser(id)
      .unwrap()
      .then(() => message.success('Користувач успішно видалено'))
      .catch(error => message.error(error.message))
  };

  const handleBlock = (id, value) => {
    blockUser({ userId: id, block: value })
      .unwrap()
      .then(() => message.success(
        value
          ? 'Користувач успішно заблокований'
          : 'Користувач успішно розблокований'
      ))
      .catch(error => message.error(error.message))
  }

  const handleOpenModal = (data) => {
    setEditId(data.id);
    form.setFieldsValue({
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: data.email,
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
        accessorKey: 'full_name',
        header: "Ім'я",
        accessorFn: row => `${row.surname} ${row.name}`,
        cell: data => {
          const { name, surname } = data.row.original;

          return `${surname} ${name}`;
        }
      },
      {
        accessorKey: 'phone',
        header: "Телефон",
      },
      {
        accessorKey: 'email',
        header: "Пошта",
      },
      {
        accessorKey: 'role',
        header: "Роль",
      },
      {
        accessorKey: 'userType',
        header: "Тип",
        cell: data => data.row.original?.userType?.name,
        meta: {
          filterVariant: 'select',
          filterSelectData: types.map(type => type.name),
        }
      },
      {
        accessorKey: 'isBlocked',
        header: "Блокування",
        enableColumnFilter: false,
        cell: data => {
          const { isBlocked } = data.row.original;

          return (
            <div style={{ textAlign: "center" }}>
              {isBlocked ? (
                <FiCheck color={green[5]} size={24} />
              ) : (
                <IoClose color={red[5]} size={24} />
              )}
            </div>
          );
        }
      },
      {
        accessorKey: 'createdAt',
        header: "Зареєстрований",
        sortingFn: 'datetime',
        accessorFn: row => new Date(row.createdAt).toLocaleString("uk-UA"),
        enableColumnFilter: false,
      },
      {
        header: " ",
        cell: data => (
          <Space size="small">
            <Link to={`/accounts/${data.row.original.id}`}>
              <Button
                title="Переглянути"
                icon={<LuEye />}
              />
            </Link>
            <Button
              title="Редагувати"
              icon={<LuPencil />}
              onClick={() => handleOpenModal(data.row.original)}
            />
            {data.row.original.isBlocked ? (
              <Button
                title="Розблокувати"
                icon={<FaLockOpen />}
                onClick={() => handleBlock(data.row.original.id, false)}
                disabled={isBlocking}
                danger
              />
            ) : (
              <Popconfirm
                title="Блокування користувача"
                description="Ви дійсно бажаєте заблокувати цього користувача?"
                onConfirm={() => handleBlock(data.row.original.id, true)}
                disabled={isBlocking}
              >
                <Button
                  title="Заблокувати"
                  icon={<FaLock />}
                  danger
                />
              </Popconfirm>
            )}
            <Popconfirm
              title="Видалити користувача"
              description="Ви дійсно бажаєте видалити цього користувача?"
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
    [types]
  )

  if (isLoading || isLoadingTypes) return <Loading />;

  return (
    <>
      <Typography.Title level={3}>Користувачі</Typography.Title>

      <DataTable data={users} columns={columns} />

      <EditUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        form={form}
        userId={editId}
      />
    </>
  );
}
