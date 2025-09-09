import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Input, Button, Modal, Form, message, Dropdown, Space } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// ... (Styled Components remain the same)
const CardWrapper = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  background-color: #A7C6FF; 
  height: 150px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #8B8D98;
`;

const AdminCourseActions = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 16px;
    padding: 4px;
`;
const CourseCard = ({ course, onEdit, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEdit = (e) => {
      e.domEvent.stopPropagation();
      if (onEdit) {
          onEdit(course);
      } else {
          message.info('Edit functionality is not available.');
      }
  };

  const handleDelete = (e) => {
      e.domEvent.stopPropagation();
      if (onDelete) {
          onDelete(course);
      } else {
          message.error("Delete function not provided.");
      }
  };

  const menuItems = [
      { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: handleEdit },
      { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: handleDelete }
  ];

  return (
    <CardWrapper onClick={() => navigate(`/course/${course._id}`)}>
        {user?.isAdmin && (
            <AdminCourseActions>
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" shape="circle" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            </AdminCourseActions>
        )}
        <ImagePlaceholder />
        <ContentWrapper>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
        </ContentWrapper>
    </CardWrapper>
  );
};
const CoursesContainer = styled.section`
  padding: 4rem 2rem;
  background-color: #F9FAFB;
  min-height: 80vh;
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Toolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoursesSection = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState(null);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/courses?keyword=${searchTerm}`);
            setCourses(response.data.data);
        } catch (error) {
            message.error('Failed to fetch courses.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCourses();
    }, []); 

    const handleAddCourse = async (values) => {
        try {
            await API.post('/courses', values);
            message.success('Course created!');
            setIsAddModalVisible(false);
            addForm.resetFields();
            fetchCourses();
        } catch (error) {
            message.error('Failed to create course.');
        }
    };

    const handleUpdateCourse = async (values) => {
        try {
            await API.put(`/courses/${editingCourse._id}`, values);
            message.success('Course updated successfully!');
            setIsEditModalVisible(false);
            setEditingCourse(null);
            editForm.resetFields();
            fetchCourses();
        } catch (error) {
            message.error('Failed to update course.');
        }
    };
    
    const handleEditClick = (course) => {
        setEditingCourse(course);
        editForm.setFieldsValue(course);
        setIsEditModalVisible(true); 
    };

    const showDeleteModal = (course) => {
        setDeletingCourse(course);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/courses/${deletingCourse._id}`);
            message.success('Course deleted successfully.');
            setIsDeleteModalVisible(false);
            setDeletingCourse(null);
            fetchCourses(); // Refresh the list
        } catch (error) {
            message.error('Failed to delete course.');
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearch = () => {
        fetchCourses();
    };

  return (
    <CoursesContainer>
      <SectionHeader>
          <SectionTitle>Our Courses</SectionTitle>
      </SectionHeader>
            
      <Toolbar>
        <Input
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ maxWidth: '400px' }}
            prefix={<SearchOutlined />}
        />
        {user?.isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)} style={{ background: 'linear-gradient(to right, #4C75C4, #80A8F1)', border: 'none' }}>
                Add Course
            </Button>
        )}
      </Toolbar>

      <Grid>
        {courses.map((course) => (
            <CourseCard key={course._id} course={course} onEdit={handleEditClick} onDelete={showDeleteModal} />
        ))}
      </Grid>

      {/* Modal for ADDING a course */}
      <Modal
          title="Add New Course"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          onOk={() => addForm.submit()}
          okText="Create"
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddCourse}>
            <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
      </Modal>
            
      {/* Modal for EDITING a course */}
      <Modal
          title="Edit Course"
          open={isEditModalVisible}
          onCancel={() => {
              setIsEditModalVisible(false);
              setEditingCourse(null);
          }}
          onOk={() => editForm.submit()}
          okText="Save Changes"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateCourse}>
            <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
      </Modal>
      <Modal
          title="Delete Course"
          open={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          okType="danger"
      >
          <p>Are you sure you want to delete the course titled "{deletingCourse?.title}"?</p>
          <p>All materials within this course will also be permanently deleted.</p>
      </Modal>
    </CoursesContainer>
  );
};

export default CoursesSection;