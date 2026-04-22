import { Button, Form, Modal, Select, Table, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { Input } from "postcss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrderAdmin() {
  const [shipper, setShipper] = useState([]);
  const [idOder, setIdOder] = useState("");
  const fetchShipper = async () => {
    const reponse = await axios.get(`http://localhost:5213/api/Shipper`);

    const data = reponse.data.data;
    console.log({ data });
    const list = data.map((shipper, index) => ({
      value: shipper.id,
      label: <span>{shipper.fullName}</span>,
    }));
    setShipper(list);
  };
  useEffect(() => {
    fetchShipper();
  }, []);

  const [formVariable] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [datasource, setDataSource] = useState([]);
  const columns = [
    {
            title: 'Ngày đặt', // Đổi tên cho thân thiện
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => {
                // Nếu date bị lỗi 0001-01-01 thì hiện N/A, ngược lại hiện ngày giờ VN
                if (!date || date.startsWith('0001')) return <span>N/A</span>;
                return new Date(date).toLocaleString('vi-VN');
            }
    },
    // {
    //   title: "shippedDate",
    //   dataIndex: "shippedDate",
    //   key: "shippedDate",
    // },
    {
            title: 'Địa chỉ', 
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => <b>{price?.toLocaleString()} đ</b> // Format tiền tệ
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusOrder',
            key: 'statusOrder',
            render: (status) => <Tag color="blue">{status}</Tag>
        },
        {
            title: 'Tiến độ giao', 
            dataIndex: 'deliveryStatus',
            key: 'deliveryStatus',
            render: (text, record) => {
                // Kiểm tra nếu trạng thái đơn hàng là Delivered (Đã giao) hoặc Received (Đã nhận)
                if (record.statusOrder === 'Delivered' || record.statusOrder === 'Received') {
                    return <Tag color="green">Done</Tag>; // Hiện chữ Done
                }
                // Các trường hợp còn lại (đang xử lý)
                return <Tag color="orange">{text || 'Processing'}</Tag>;
            }
        },
    {
      title: 'Hành động', // Cột bạn muốn sửa
      key: 'action',
      render: (_, record) => {
                // Logic hiển thị dựa trên statusOrder
                
                // 1. Nếu Restaurant đã bấm "Giao cho Drone"
                if (record.statusOrder === 'Delivering' || record.statusOrder === 'InTransit') {
                    return (
                        <Tag color="geekblue" style={{ fontSize: '14px', padding: '5px 10px' }}>
                            🚚 Đang vận chuyển
                        </Tag>
                    );
                }

                // 2. Nếu Restaurant/Drone đã bấm "Xác nhận đã giao"
                if (record.statusOrder === 'Delivered' || record.statusOrder === 'Received') {
                    return (
                        <Tag color="green" style={{ fontSize: '14px', padding: '5px 10px' }}>
                            Hoàn thành đơn
                        </Tag>
                    );
                }
                
                // 3. Nếu đơn đã bị hủy
                if (record.statusOrder === 'Cancelled') {
                    return <Tag color="red">Đã hủy</Tag>;
                }

                // 4. Các trạng thái còn lại (Pending, Paid, Cooking, Ready...)
                // Giữ nguyên nút Delivery cũ hoặc hiển thị trạng thái chờ
                return (
                     <Button type="primary" style={{background: '#fa8c16'}}>
                        Chờ xử lý
                     </Button>
                );
            }
    },
  ];
  console.log(idOder);
  function handleShowModal() {
    setIsOpen(true);
  }

  function handleHideModal() {
    setIsOpen(false);
  }

  async function fetchOrder() {
    const response = await axios.get(
      "http://localhost:5213/api/Orders/ViewAllOrder"
    );
    setDataSource(response.data.data);
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  async function handleEditShipper(value) {
    console.log(value.ShipperId);
    try {
      const response = await axios.put(
        `http://localhost:5213/api/Orders/UpdateOrderForShipper/${idOder}`,
        {
          shipperId: value.ShipperId,
        }
      );
      fetchOrder();
      formVariable.resetFields;
      handleHideModal();
      toast.success("Assign to the shipper Successfully");
    } catch (error) {
      toast.error("Assign Fail");
      console.log(e);
    }
  }
  return (
    <div>
      <Table columns={columns} dataSource={datasource}></Table>
      <Modal
        open={isOpen}
        Title="Add Shipper"
        onCancel={handleHideModal}
        onOk={() => formVariable.submit()}
      >
        <Form form={formVariable} onFinish={handleEditShipper}>
          <Form.Item
            label="Shipper"
            name="ShipperId"
            rules={[
              {
                required: true,
                message: "Please Input Shipper",
              },
            ]}
          >
            <Select options={shipper} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default OrderAdmin;
