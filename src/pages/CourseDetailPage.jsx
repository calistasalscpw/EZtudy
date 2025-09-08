import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import MaterialViewer from '../components/MaterialViewer';
import CourseHome from '../components/CourseHome';

// --- Mock Data ---
// In a real app, you would fetch this from your API using the courseId
const courseDataMock = {
    id: 'ai-ethics-101',
    title: '01 AI Ethics and Data Security',
    progress: 100, // Example progress
    materials: [
        { id: '1', type: 'video', title: 'Introduction to AI Ethics', videoId: '13p3ALGsl4w' },
        { id: '2', type: 'pdf', title: '[PDF] AI Ethics and Data Security' },
        { id: '3', type: 'quiz', title: '[Q1] Gen AI' },
        { id: '4', type: 'quiz', title: '[Q2] Critics of AI' },
        { id: '5', type: 'quiz', title: '[Q3] AI and privacy' },
    ]
};

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
`;

const CourseDetailPage = () => {
    const { courseId } = useParams(); // Gets 'ai-ethics-101' from the URL
    const [course, setCourse] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Effect to fetch course data
    useEffect(() => {
        // Simulating an API call
        setCourse(courseDataMock);
        // Set the initial view to be the course home (no material selected)
        setSelectedMaterial(null); 
    }, [courseId]);

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
                selectedMaterialId={selectedMaterial?.id}
                onSelectMaterial={setSelectedMaterial}
            />
            <MainContent>
                {selectedMaterial ? (
                    <MaterialViewer material={selectedMaterial} onBack={handleShowOverview} />
                ) : (
                    <CourseHome course={course} onSelectMaterial={setSelectedMaterial} />
                )}
            </MainContent>
        </PageWrapper>
    );
};

export default CourseDetailPage;