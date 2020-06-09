/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col, DatePicker, Divider, Select, message } from 'antd'
import moment from 'moment'
import request from '@/utils/request';


const EditModal = (props) => {


    const [form] = Form.useForm();
    const [maskClosable,] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);
    const [companyOptions, setCompanyOptions] = useState([]);

    const timeOut = (m) => {
        setTimeout(() => {
            setIsSubmit(false);
        },
            m);
    }

    useEffect(() => {
        if (props.visible) {
            const departmentId = `${props.editObj.departmentId}:${props.editObj.departmentName}`;
            const companyId = `${props.editObj.companyId}:${props.editObj.companyName}`;
            const serviceStaffId = `${props.editObj.serviceStaffId}:${props.editObj.serviceStaff}`;
            const phoneStaffId = `${props.editObj.phoneStaffId}:${props.editObj.phoneStaff}`;
            const helpStaffId = `${props.editObj.helpStaffId}:${props.editObj.helpStaff}`;
            const customerId = `${props.editObj.customerId}:${props.editObj.customerName}`;
            form.setFieldsValue({
                ...props.editObj,
                operatTime: moment(props.editObj.operatTime, 'YYYY-MM-DD'),
                id: props.editObj.key,
                departmentId,
                companyId,
                serviceStaffId,
                phoneStaffId,
                helpStaffId,
                customerId
            })
            onChange4Customer(customerId);
        }
    }, [props.visible])
    

    const handleCancel = () => {
        Modal.confirm({
            title: '添加订单',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {
            }
        })
    }

    const update = (data) =>{
        request.post('/api/base/order/update', {
            data,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('修改成功');
                timeOut(20000);
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data?res.data:"修改失败，原因不明，请联系维护人员");
            }
        })
    }

    const onFinish = () => {
        if(isSubmit){
            if (localStorage.getItem('userName').trim() === form.getFieldValue('createUserName2').trim()) {
                // 填表人与登录用户是否一致
                // if(moment().isBefore(moment().locale('zh-cn').format('YYYY-MM-DD'),
                //     form.getFieldValue('operatTime').format('YYYY-MM-DD'))){
                     // eslint-disable-next-line eqeqeq
                if (Math.floor(form.getFieldValue('loan')) == form.getFieldValue('loan')) {
                    // eslint-disable-next-line eqeqeq
                    if (Math.floor(form.getFieldValue('serviceRate')) == form.getFieldValue('serviceRate')) {
                        // eslint-disable-next-line eqeqeq
                        if (Math.floor(form.getFieldValue('serviceMoney')) == form.getFieldValue('serviceMoney')) {
                            // eslint-disable-next-line eqeqeq
                            if (Math.floor(form.getFieldValue('otherCost')) == form.getFieldValue('otherCost')) {
                                // eslint-disable-next-line eqeqeq
                                if (Math.floor(form.getFieldValue('getMoney')) == form.getFieldValue('getMoney')) {
                                    if (Math.floor(form.getFieldValue('getMoney')) <= form.getFieldValue('serviceMoney')) {
                                        // 校验完成
                                    const data = {
                                        ...form.getFieldsValue(),
                                        id: form.getFieldValue("key"),
                                        userId: localStorage.getItem("userId"),
                                        createUserName: localStorage.getItem('userName').trim(),
                                        operatTime: form.getFieldValue('operatTime').format('YYYY-MM-DD'),
                                        departmentId: form.getFieldValue('departmentId').split(":")[0],
                                        departmentName: form.getFieldValue('departmentId').split(":")[1],
                                        companyId: form.getFieldValue('companyId').split(":")[0],
                                        companyName: form.getFieldValue('companyId').split(":")[1],
                                        serviceStaffId: form.getFieldValue('serviceStaffId').split(":")[0],
                                        serviceStaff: form.getFieldValue('serviceStaffId').split(":")[1],
                                        phoneStaffId: form.getFieldValue('phoneStaffId').split(":")[0],
                                        phoneStaff: form.getFieldValue('phoneStaffId').split(":")[1],
                                        helpStaffId: form.getFieldValue('helpStaffId').split(":")[0],
                                        helpStaff: form.getFieldValue('helpStaffId').split(":")[1],
                                        customerId: form.getFieldValue('customerId').split(":")[0],
                                        customerName: form.getFieldValue('customerId').split(":")[1],
                                    }
                                        // 修改
                                        Modal.confirm({
                                            title: '新增订单',
                                            content: '已收金额大于小款金额，输入有误，请重新输入！',
                                            onOk () {
                                                update(data);
                                                setIsSubmit(true);
                                            }
                                        })
                                    
                                    }else{
                                        setIsSubmit(true);
                                        Modal.confirm({
                                            title: '修改订单',
                                            content: '已收金额大于小款金额，输入有误，请重新输入！',
                                        })
                                    }
                                    
                                } else {
                                    setIsSubmit(true);
                                    Modal.confirm({
                                        title: '修改订单',
                                        content: '已收金额输入有误（只能是数字或小数），请重新输入！',
                                    })
                                }
                            } else {
                                setIsSubmit(true);
                                Modal.confirm({
                                    title: '修改订单',
                                    content: '其他费用输入有误（只能是数字或小数），请重新输入！',
                                })
                            }
                        } else {
                            setIsSubmit(true);
                            Modal.confirm({
                                title: '修改订单',
                                content: '小款金额输入有误（只能是数字或小数），请重新输入！',
                            })
                        }
                    } else {
                        setIsSubmit(true);
                        Modal.confirm({
                            title: '修改订单',
                            content: '小款点位输入有误（只能是数字或小数），请重新输入！',
                        })
                    }
                } else {
                    setIsSubmit(true);
                    Modal.confirm({
                        title: '修改订单',
                        content: '下款金额输入有误（只能是数字或小数），请重新输入！',
                    })
                }
                // }else{
                //     Modal.confirm({
                //         title: '修改订单',
                //         content: '操作时间在开单时间必须在开单时间之前',   
                //     })
                // }
            } else {
                setIsSubmit(true);
                Modal.confirm({
                    title: '修改订单',
                    content: '填表人与登录用户不一致！！请重新确认（填表人与登录用户必须一致）！',
                })
            }
            setIsSubmit(true);
        }else{
            message.error("操作太频繁，请稍后20秒再试！！")
        }
        
    }



    function onChange(value) {
        console.log(`selected ${value}`);
    }

    async function  onChange4Customer (value) {
        
        try {
            const res = await request.get('/api/base/company/getOne', {
              params: {
                userId: localStorage.getItem('userId'),
                customerId: value.split(":")[0],
              },
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })
            if (res.code === '0000') {
                let a = [];
                a.push(res.data);
                setCompanyOptions(a);
            }
          } catch (error) {
            console.log(111, error);
          }     
        
    }


    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    return (
        <div>
            <Modal
                id='addModal'
                title={props.title}
                visible={props.visible}
                onCancel={handleCancel}
                maskClosable={maskClosable}
                destroyOnClose
                getContainer={false}
                width={800}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
            >
                <Form
                    form={form}
                    // name=""
                    // className=""
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item
                                name="key"
                                label="编号"
                            >
                                <Input placeholder="编号" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="createUserName"
                                label="填表人"
                            >
                                <Input defaultValue={localStorage.getItem('userName')} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                format='YYYY-MM-DD'
                                name="operatTime"
                                label="操作时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择部门成立日期',
                                    },
                                ]}
                            >
                                <DatePicker />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="departmentId"
                                label="部门"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择部门',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.departmentOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                    <Col span={6}>
                            <Form.Item
                                name="customerId"
                                label="客户"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择客户',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange4Customer}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.customerOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="serviceStaffId"
                                label="主办人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择主办人',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="helpStaffId"
                                label="辅助人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择辅助人',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="phoneStaffId"
                                label="电销"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择电销',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item
                                name="companyId"
                                label="贷款企业"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择贷款企业',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {companyOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item
                                name="bankName"
                                label="下款银行"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择银行',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.bankOptions.map(v => {
                                        return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="loan"
                                label="下款金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入下款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="下款金额" />
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="serviceRate"
                                label="小款点位(%)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款点位',
                                    },
                                ]}
                            >
                                <Input placeholder="小款点位" />
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="serviceMoney"
                                label="小款金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="小款金额" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="isGet"
                                label="收款情况"
                                rules={[
                                    {
                                        required: true,
                                        message: '填是或否',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                                    <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                                    <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="otherCost"
                                label="其他费用(￥)"
                            >
                                <Input placeholder="其他费用(￥)" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入已收金额',
                                    }
                                ]}
                            >
                                <Input placeholder="已收金额" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="needInvoice"
                                label="是否开票"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="是">是</Select.Option>
                                    <Select.Option key={2} value="否">否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input placeholder="备注" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入填表人',
                                    },
                                ]}
                            >
                                <Input placeholder="填表人签名" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Button style={{
                                marginLeft: 8,
                            }}
                                type="primary"
                                htmlType="submit"
                                disable={ props.type !== 'add' || props.type !== 'edit' }
                            >
                                提交
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={handleCancel}
                            >
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default EditModal;

