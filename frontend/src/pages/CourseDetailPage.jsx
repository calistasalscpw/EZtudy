import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import MaterialViewer from '../components/MaterialViewer';
import CourseHome from '../components/CourseHome';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Button, Modal, Form, Input, Select, message, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

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
    const [progress, setProgress] = useState({ completedMaterials: [], percentage: 0 });
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [materialType, setMaterialType] = useState('video');
    const [form] = Form.useForm();

    const fetchCourseAndProgress = async () => {
        try {
            const response = await API.get(`/courses/${courseId}`);
            setCourse(response.data.course);
            setProgress(response.data.progress || { completedMaterials: [], percentage: 0 });
        } catch (error) {
            message.error('Could not load course details.');
        }
    };

    useEffect(() => {
        fetchCourseAndProgress();
    }, [courseId]);
    
    const handleAddMaterial = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('type', values.type);

        if (values.type === 'file') {
            formData.append('materialFile', values.materialFile.file.originFileObj);
        } else {
            formData.append('source', values.source);
        }

        try {
            await API.post(`/courses/${courseId}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            message.success('Material added successfully!');
            setIsModalVisible(false);
            form.resetFields();
            fetchCourseAndProgress();
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
                 {selectedMaterial ? (
                    <MaterialViewer 
                        material={selectedMaterial} 
                        onBack={() => setSelectedMaterial(null)}
                        refreshData={fetchCourseAndProgress} 
                    />
                ) : (
                    <CourseHome 
                        course={course} 
                        onSelectMaterial={setSelectedMaterial}
                        onAddMaterial={() => setIsModalVisible(true)} 
                        refreshData={fetchCourseAndProgress}
                    />
                )}
            </MainContent>
            
            <Modal
                title="Add New Material"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleAddMaterial}>
                    <Form.Item name="title" label="Material Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select onChange={(value) => setMaterialType(value)} placeholder="Select material type">
                            <Option value="video">YouTube Video</Option>
                            <Option value="file">File Upload</Option>
                        </Select>
                    </Form.Item>
                    {materialType === 'video' ? (
                        <Form.Item name="source" label="YouTube Video ID" rules={[{ required: true }]}>
                            <Input placeholder="e.g., 13p3ALGsl4w" />
                        </Form.Item>
                    ) : (
                        <Form.Item name="materialFile" label="Upload File" rules={[{ required: true }]}>
                            <Upload maxCount={1} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </PageWrapper>
    );
};

export default CourseDetailPage;