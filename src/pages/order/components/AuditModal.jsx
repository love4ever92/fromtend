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
                createUserName2: props.editObj.createUserName,
                customerId,
            })
            if(props.type == 'confirm'){
                document.getElementById("btn3").style.display="none";
                document.getElementById("btn4").style.display="none";
            }else{
                document.getElementById("btn1").style.display="none";
                document.getElementById("btn2").style.display="none";
            }
            

        }
    }, [props.visible])
    

    const handleCancel = () => {
        Modal.confirm({
            title: '关闭订单详情',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {

            }
        })
    }

    /**
     * 财务负责人确认
     * @param {} params 
     */
    const finance = (params) =>{
        request.get('/api/base/order/finance', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('审核提交成功');
                timeOut(20000);
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data:"审核提交成功失败，原因不明，请联系维护人员");
            }
        })
    }

    /**
     * 业务负责人确认
     * @param {} params 
     */
    const confirm = (params) =>{
        request.get('/api/base/order/confirm', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('审核提交成功');
                timeOut(20000);
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data : "审核提交成功失败，原因不明，请联系维护人员");
            }
        })
    }

    const onFinish = () => {
        if(isSubmit){
            setIsSubmit(false);
            if(props.type == "confirm"){
                const params={
                    
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    confirmOpinion: form.getFieldValue('confirmOpinion'),
                    confirmStaff: form.getFieldValue('confirmStaff'),
                    confirmReason: form.getFieldValue('confirmReason'),
                }
                if(form.getFieldValue('confirmOpinion')=="不同意"){
                    if(form.getFieldValue('confirmReason')){
                        confirm(params);
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    confirm(params);
                }
                setIsSubmit(true);
            }else if(props.type == "finance"){
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    financeOpinion: form.getFieldValue('financeOpinion'),
                    financeStaff: form.getFieldValue('financeStaff'),
                    financeReason: form.getFieldValue('financeReason'),
                }
                if(form.getFieldValue('financeOpinion')=="不同意"){
                    if(form.getFieldValue('financeReason')){
                        finance(params);
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    finance(params);
                }
            }else{
                setIsSubmit(true);
            }
            setIsSubmit(true);
        }else{
            message.error("操作太频繁，请稍后20秒再试！！");
        }
        
    }



    function onChange(value) {
        console.log(`selected ${value}`);
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
                                <Input  disabled />
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
                            >
                                <DatePicker disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="departmentId"
                                label="部门"
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
                                    disabled
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
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.companyOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item
                                name="bankName"
                                label="下款银行"
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
                                    disabled
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
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="serviceRate"
                                label="小款点位(%)"
                            >
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="serviceMoney"
                                label="小款金额(￥)"
                            >
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="isGet"
                                label="收款情况"
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
                                    disabled
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
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                            >
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                    <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                                
                            >
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="confirmStaff"
                                label="业务负责人"
                                rules={[
                                    {
                                        required: props.type==="confirm",
                                        message: '业务负责人签名',
                                    },
                                ]}
                            >
                                <Input placeholder="业务负责人签名"  disabled={props.type==="finance" } />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="confirmOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="confirm",
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
                                    disabled={props.type==="finance" }
                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Button 
                                id="btn1"
                                style={{
                                marginLeft: 8,
                            }}
                                type="primary"
                                htmlType="submit"
                            >
                                提交
                            </Button>
                            <Button
                                id="btn2"
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
                    <Row gutter={24}>
                    <Col span={24}>
                            <Form.Item
                                name="confirmReason"
                                label="处理意见"
                            >
                                <Input placeholder="处理意见" disabled={props.type==="finance" } />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="financeStaff"
                                label="财务负责人"
                                rules={[
                                    {
                                        required: props.type==="finance",
                                        message: '财务负责人签名',
                                    },
                                ]}
                            >
                                <Input  placeholder="财务负责人签名" disabled={ props.type==="confirm" } />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="financeOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="finance",
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
                                    disabled={props.type==="confirm" }
                                >
                                    <Select.Option key={0} disabled value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Button 
                                id="btn3"
                                style={{
                                    marginLeft: 8,
                                }}
                                type="primary"
                                htmlType="submit"
                            >
                                提交
                            </Button>
                            <Button
                                id="btn4"
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
                    <Row gutter={24}>
                    <Col span={24}>
                            <Form.Item
                                name="financeReason"
                                label="处理意见"
                            >
                                <Input placeholder="处理意见"  disabled={props.type === "confirm" }/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default EditModal;
