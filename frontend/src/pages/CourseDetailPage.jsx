import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import MaterialViewer from '../components/MaterialViewer';
import CourseHome from '../components/CourseHome';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Button, Modal, Form, Input, Select, message, Upload, List, Avatar, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

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

const GradientButton = styled(Button)`
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(to right, #6a82ea, #7d53a9);
    color: white !important;
  }
`;

const CourseDetailPage = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState({ completedMaterials: [], percentage: 0 });
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingMaterial, setDeletingMaterial] = useState(null);

    const [materialType, setMaterialType] = useState('video');
    const [files, setFiles] = useState([]);

    const [youtubeSearch, setYoutubeSearch] = useState('');
    const [youtubeResults, setYoutubeResults] = useState([]);
    const [youtubeLoading, setYoutubeLoading] = useState(false);
    
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

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

        if (values.type === 'file' && values.materialFile?.[0]?.originFileObj) {
            formData.append('materialFile', values.materialFile[0].originFileObj);
        } else if (values.type === 'video') {
            formData.append('source', values.source);
        } else {
            message.error('Please select a file to upload.');
            return;
        }

        try {
            await API.post(`/courses/${courseId}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            message.success('Material added successfully!');
            setIsAddModalVisible(false);
            addForm.resetFields();
            setFiles([]);
            fetchCourseAndProgress();
        } catch (error) {
            message.error('Failed to add material.');
        }
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setMaterialType(material.type);
        editForm.setFieldsValue({
            title: material.title,
            type: material.type,
            source: material.type === 'video' ? material.source : undefined,
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateMaterial = async (values) => {
        try {
            const payload = {
                title: values.title,
                source: values.source,
            };
            await API.put(`/courses/${courseId}/materials/${editingMaterial._id}`, payload);
            message.success('Material updated successfully!');
            setIsEditModalVisible(false);
            editForm.resetFields();
            setEditingMaterial(null);
            
            // Refresh data and go back to overview
            await fetchCourseAndProgress();
            setSelectedMaterial(null);
        } catch (error) {
            message.error('Failed to update material.');
        }
    };

    const showDeleteModal = (material) => {
        setDeletingMaterial(material);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteMaterial = async () => {
        try {
            await API.delete(`/courses/${deletingMaterial.course}/materials/${deletingMaterial._id}`);
            message.success('Material deleted.');
            setIsDeleteModalVisible(false);
            setDeletingMaterial(null);
            await fetchCourseAndProgress();
            setSelectedMaterial(null); // Go back to overview
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete material.');
            setIsDeleteModalVisible(false);
        }
    };

    const handleYoutubeSearch = async (value) => {
        if (!value) {
            setYoutubeResults([]);
            return;
        }
        setYoutubeLoading(true);
        try {
            const response = await API.get(`/youtube/search?q=${value}`);
            setYoutubeResults(response.data);
        } catch (error) {
            message.error('Failed to search for videos.');
        } finally {
            setYoutubeLoading(false);
        }
    };

    if (!course) {
        return <div>Loading...</div>; 
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
                        onEdit={handleEditMaterial}
                        onDelete={showDeleteModal}
                    />
                ) : (
                    <CourseHome 
                        course={course} 
                        progress={progress}
                        onSelectMaterial={setSelectedMaterial}
                        onAddMaterial={() => setIsAddModalVisible(true)} 
                        refreshData={fetchCourseAndProgress}
                    />
                )}
            </MainContent>
            
            {/* ADD MATERIAL MODAL */}
            <Modal
                title="Add New Material"
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsAddModalVisible(false)}>
                      Cancel
                    </Button>,
                    <GradientButton key="submit" type="primary" onClick={() => addForm.submit()}>
                      Create
                    </GradientButton>,
                ]}
            >
                <Form form={addForm} layout="vertical" onFinish={handleAddMaterial}>
                    <Form.Item name="title" label="Material Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select a material type' }]} initialValue="video">
                        <Select onChange={(value) => setMaterialType(value)} placeholder="Select material type">
                            <Option value="video">YouTube Video</Option>
                            <Option value="file">File Upload</Option>
                        </Select>
                    </Form.Item>
                    {materialType === 'video' ? (
                        <>
                            <Search
                                placeholder="Search for a YouTube video..."
                                size="large"
                                onSearch={handleYoutubeSearch}
                                loading={youtubeLoading}
                                allowClear
                                enterButton={
                                    <Button
                                        type="primary"
                                        style={{
                                            background: "linear-gradient(to right, #667eea, #764ba2)",
                                            border: "none",
                                        }}
                                    >
                                            Search
                                    </Button>
                                }
                            />
                            <List
                                itemLayout="horizontal"
                                dataSource={youtubeResults}
                                renderItem={(item) => (
                                    <List.Item
                                        onClick={() => {
                                            addForm.setFieldsValue({
                                                title: item.title,
                                                source: item.videoId,
                                            });
                                            setYoutubeResults([]);
                                        }}
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: '#F6F9FF',
                                            padding: '10px',
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.thumbnail} />}
                                            title={
                                                <span style={{ color: '#3E66B4', fontWeight: 500 }}>
                                                    {item.title}
                                                </span>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                            <Form.Item name="source" label="YouTube Video ID" rules={[{ required: true }]}>
                                <Input placeholder="e.g., 13p3ALGsl4w" />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item name="materialFile"
                            label="Upload File"
                            valuePropName="fileList"
                            getValueFromEvent={e => e.fileList}
                            rules={[{ required: true, message: 'Please upload a file' }]}
                        >
                            <Upload 
                                fileList={files} 
                                onChange={({ fileList: newFileList }) => setFiles(newFileList)}
                                beforeUpload={() => false} 
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* EDIT MATERIAL MODAL */}
            <Modal
                title="Edit Material"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingMaterial(null);
                    editForm.resetFields();
                }}
                footer={[
                    <Button key="back" onClick={() => { setIsEditModalVisible(false); setEditingMaterial(null); }}>
                      Cancel
                    </Button>,
                    <GradientButton key="submit" type="primary" onClick={() => editForm.submit()}>
                      Save Changes
                    </GradientButton>,
                ]}
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdateMaterial}>
                    <Form.Item name="title" label="Material Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type">
                        <Select disabled>
                            <Option value="video">YouTube Video</Option>
                            <Option value="file">File Upload</Option>
                        </Select>
                    </Form.Item>
                    {editingMaterial?.type === 'video' ? (
                        <Form.Item name="source" label="YouTube Video ID" rules={[{ required: true }]}>
                            <Input placeholder="e.g., 13p3ALGsl4w" />
                        </Form.Item>
                    ) : (
                        <Form.Item label="Upload File">
                            <p>File replacement is not supported. Please delete and create a new material to change the file.</p>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* DELETE MATERIAL CONFIRMATION MODAL */}
            <Modal
                title="Delete Material"
                open={isDeleteModalVisible}
                onOk={handleDeleteMaterial}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Delete"
                okType="danger"
            >
                <p>Are you sure you want to delete the material titled "{deletingMaterial?.title}"?</p>
                <p>This action cannot be undone.</p>
            </Modal>
        </PageWrapper>
    );
};

export default CourseDetailPage;