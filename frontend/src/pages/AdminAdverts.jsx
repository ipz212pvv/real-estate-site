import { useMemo } from "react";
import { Link } from "react-router";
import { LuEye, LuPencil } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { Typography, Space, Button, Popconfirm, message} from "antd";
import { green, red } from "@ant-design/colors";

import { Loading } from "@/components/common/Loading/Loading.jsx";
import { DataTable } from "@/components/common/DataTable/DataTable.jsx";

import { useGetAdvertsQuery, useDeleteAdvertMutation } from "@/store/services/adverts.js";
import { useGetAdvertPropertyTypesQuery } from "@/store/services/advert-property-types.js";
import { useGetAdvertTypesQuery } from "@/store/services/advert-types.js";

export function AdminAdverts() {
  const { data, isLoading } = useGetAdvertsQuery();
  const { data: propertyTypes = [], isLoading: isLoadingPropertyTypes } = useGetAdvertPropertyTypesQuery();
  const { data: types = [], isLoading: isLoadingTypes } = useGetAdvertTypesQuery();
  const [deleteAdvert, { isLoading: isDeleting }] = useDeleteAdvertMutation();

  const handleDelete = async (id) => {
      deleteAdvert(id)
        .unwrap()
        .then(() => message.success('Оголошення успішно видалено'))
        .catch(error => message.error(error))
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: "ID",
      },
      {
        accessorKey: 'title',
        header: "Назва",
      },
      {
        accessorKey: 'price_usd',
        header: "Ціна $",
        enableColumnFilter: false,
      },
      {
        accessorKey: 'advertTypeForAdvert.name',
        header: "Тип операції",
        meta: {
          filterVariant: 'select',
          filterSelectData: types.map(type => type.name),
        }
      },
      {
        accessorKey: 'advertPropertyTypeForAdvert.name',
        header: "Тип нерухомості",
        meta: {
          filterVariant: 'select',
          filterSelectData: propertyTypes.map(type => type.name),
        }
      },
      {
        accessorKey: 'isHidden',
        header: "Прихований",
        enableColumnFilter: false,
        cell: data => {
          const { isHidden } = data.row.original;

          return (
            <div style={{ textAlign: "center" }}>
              {isHidden ? (
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
        header: "Створено",
        sortingFn: 'datetime',
        accessorFn: row => new Date(row.createdAt).toLocaleString("uk-UA"),
        enableColumnFilter: false,
      },
      {
        header: " ",
        cell: data => (
          <Space size="small">
            <Link to={`/adverts/${data.row.original.id}`}>
              <Button
                title="Переглянути"
                icon={<LuEye />}
              />
            </Link>
            <Link to={`/admin/adverts/${data.row.original.id}/edit?redirectTo=/admin/adverts`}>
              <Button
                title="Редагувати"
                icon={<LuPencil />}
              />
            </Link>
            <Popconfirm
              title="Видалити оголошення"
              description="Ви дійсно бажаєте видалити це оголошення?"
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
    [types, propertyTypes]
  )

  if (isLoading || isLoadingPropertyTypes || isLoadingTypes) return <Loading />;

  const { adverts } = data;

  return (
    <>
      <Typography.Title level={3}>Оголошення</Typography.Title>

      <DataTable data={adverts} columns={columns} />
    </>
  );
}