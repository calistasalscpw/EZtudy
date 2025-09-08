import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import MaterialViewer from '../components/MaterialViewer';
import CourseHome from '../components/CourseHome';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  padding-top: 65px; 
  height: 100vh; 
  box-sizing: border-box;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  background-color: #F9FAFB;
  position: relative;
`;

const AdminControls = styled.div`
    position: absolute;
    top: 2rem;
    right: 3rem;
`;

const CourseDetailPage = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchCourseDetails = async () => {
        try {
            const response = await API.get(`/courses/${courseId}`);
            setCourse(response.data);
        } catch (error) {
            message.error('Could not load course details.');
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);
    
    const handleAddMaterial = async (values) => {
        try {
            await API.post(`/courses/${courseId}/materials`, values);
            message.success('Material added successfully!');
            setIsModalVisible(false);
            form.resetFields();
            fetchCourseDetails();
        } catch (error) {
            message.error('Failed to add material.');
        }
    };

    if (!course) {
        return <div>Loading...</div>; 
    }

    // Function to handle clicking the "back to overview" button
    const handleShowOverview = () => {
        setSelectedMaterial(null);
    }

    return (
        <PageWrapper>
            <Sidebar
                course={course}
                selectedMaterialId={selectedMaterial?._id}
                onSelectMaterial={setSelectedMaterial}
            />
            <MainContent>
                 {user?.isAdmin && (
                    <AdminControls>
                        <Button icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                            Upload Material
                        </Button>
                    </AdminControls>
                )}

                {selectedMaterial ? (
                    <MaterialViewer material={selectedMaterial} onBack={() => setSelectedMaterial(null)} />
                ) : (
                    <CourseHome course={course} onSelectMaterial={setSelectedMaterial} />
                )}
            </MainContent>
            
            <Modal
                title="Add New Material"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Add"
            >
                <Form form={form} layout="vertical" onFinish={handleAddMaterial}>
                    <Form.Item name="title" label="Material Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="video">YouTube Video</Option>
                            <Option value="file">File (PDF, etc.)</Option>
                        </Select>
                    </Form.Item>
                     <Form.Item name="source" label="Source (YouTube Video ID or File URL)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </PageWrapper>
    );
};

export default CourseDetailPage;