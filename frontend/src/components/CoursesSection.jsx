import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Input, Button, Modal, Form, message, Dropdown, Space, Pagination, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f794a4 0%, #fdd6bd 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #ff8c42 0%, #ffc42e 100%)',
  'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
];

const CardWrapper = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  background: ${props => props.gradient};
  height: 150px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 1.5rem 0;
  font-size: 0.9rem;
  color: #8B8D98;
  flex-grow: 1;
`;


const OutlinedButton = styled(Button)`
  margin-top: auto;
  border-color: #E0E0E0;
  color: #555;
  background: white !important;

  &:hover {
    border-color: #4C75C4 !important;
    color: #4C75C4 !important;
  }
`;

const AdminCourseActions = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 50%;
`;

const CourseCard = ({ course, onEdit, onDelete, index }) => {
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
    <CardWrapper>
        {user?.isAdmin && (
            <AdminCourseActions>
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" shape="circle" icon={<MoreOutlined style={{color: '#333'}}/>} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            </AdminCourseActions>
        )}
        <ImagePlaceholder gradient={gradients[index % gradients.length]}/>
        <ContentWrapper>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
            <OutlinedButton block onClick={() => navigate(`/course/${course._id}`)}>
                Start Learning
            </OutlinedButton>
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
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4389A2, #5C258D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 3rem;
`;

const GradientButton = styled(Button)`
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
  &:hover {
    background: linear-gradient(to right, #6a82ea, #7d53a9);
  }
`;

const CoursesSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalCourses, setTotalCourses] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 6);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState(null);

    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const fetchCourses = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: currentPage,
            pageSize: pageSize,
            keyword: searchTerm,
        });

        setSearchParams(params);
        
        try {
            const response = await API.get(`/courses?${params.toString()}`);
            setCourses(response.data.data);
            setTotalCourses(response.data.total);
        } catch (error) {
            message.error('Failed to fetch courses.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCourses();
    }, [currentPage, pageSize]); 

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
        setCurrentPage(1);
        fetchCourses(1, pageSize, searchTerm);
    };

    const onPageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

  return (
    <CoursesContainer id="courses-section">
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
            allowClear
        />
        {user?.isAdmin && (
            <GradientButton type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
                Add Course
            </GradientButton>
        )}
      </Toolbar>

      {loading ? <div style={{textAlign: 'center', padding: '50px'}}><Spin size="large" /></div> : (
          <Grid>
            {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} onEdit={handleEditClick} onDelete={showDeleteModal} index={index}/>
            ))}
          </Grid>
      )}

      <PaginationContainer>
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCourses}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={['3', '6', '9', '12']}
        />
      </PaginationContainer>

      {/* Modal for ADDING a course */}
      <Modal
          title="Add New Course"
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
          onCancel={() => { setIsEditModalVisible(false); setEditingCourse(null); }}
          footer={[
            <Button key="back" onClick={() => { setIsEditModalVisible(false); setEditingCourse(null); }}>
              Cancel
            </Button>,
            <GradientButton key="submit" type="primary" onClick={() => editForm.submit()}>
              Save Changes
            </GradientButton>,
          ]}
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