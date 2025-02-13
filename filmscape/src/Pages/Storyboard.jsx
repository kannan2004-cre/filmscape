import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
const defaultShapes = {
    // Characters
    actor: { width: 40, height: 80, image: '🧍', category: 'Characters' },
    actress: { width: 40, height: 80, image: '🧍‍♀️', category: 'Characters' },
    villain: { width: 40, height: 80, image: '🦹', category: 'Characters' },
    
    // Equipment
    camera: { width: 50, height: 30, image: '📹', category: 'Equipment' },
    microphone: { width: 30, height: 60, image: '🎤', category: 'Equipment' },
    lights: { width: 40, height: 60, image: '💡', category: 'Equipment' },
    
    // Props
    chair: { width: 30, height: 40, image: '🪑', category: 'Props' },
    table: { width: 50, height: 30, image: '🪟', category: 'Props' },
    car: { width: 80, height: 40, image: '🚗', category: 'Props' }
};

const categories = ['Characters', 'Equipment', 'Props'];

const Storyboard = () => {
    <Navbar/>
    const [elements, setElements] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Characters');
    const [selectedElement, setSelectedElement] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);

    const handleAddElement = (type) => {
        const newElement = {
            id: Date.now().toString(),
            type,
            x: 200,
            y: 150,
            rotation: 0
        };
        setElements([...elements, newElement]);
    };

    const handleDragStart = (e, element) => {
        setDraggedElement(element);
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        if (draggedElement) {
            e.target.style.opacity = '1';
            const rect = e.target.getBoundingClientRect();
            const canvasRect = document.getElementById('canvas-area').getBoundingClientRect();
            
            const updatedElements = elements.map(el => {
                if (el.id === draggedElement.id) {
                    return {
                        ...el,
                        x: e.clientX - canvasRect.left - (defaultShapes[el.type].width / 2),
                        y: e.clientY - canvasRect.top - (defaultShapes[el.type].height / 2)
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            setDraggedElement(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSelect = (element) => {
        setSelectedElement(selectedElement?.id === element.id ? null : element);
    };

    const handleRotate = (direction) => {
        if (selectedElement) {
            const updatedElements = elements.map(el => {
                if (el.id === selectedElement.id) {
                    return {
                        ...el,
                        rotation: el.rotation + (direction === 'left' ? -15 : 15)
                    };
                }
                return el;
            });
            setElements(updatedElements);
        }
    };

    return (
        <div style={{ display: 'flex', padding: '20px', backgroundColor: '#121212', minHeight: '100vh' }}>
            
            {/* Toolbar */}
            <div style={{ 
                width: '200px',
                backgroundColor: '#1e1e1e',
                padding: '20px',
                marginRight: '20px',
                borderRadius: '8px'
            }}>
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '15px',
                        backgroundColor: '#2d2d2d',
                        color: 'white',
                        border: '1px solid #333',
                        borderRadius: '4px'
                    }}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {Object.entries(defaultShapes)
                        .filter(([_, shape]) => shape.category === selectedCategory)
                        .map(([type, shape]) => (
                            <button
                                key={type}
                                onClick={() => handleAddElement(type)}
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#2d2d2d',
                                    border: '1px solid #333',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '20px'
                                }}
                            >
                                {shape.image}
                            </button>
                        ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div style={{ flex: 1 }}>
                <div 
                    id="canvas-area"
                    style={{
                        width: '800px',
                        height: '500px',
                        backgroundColor: 'white',
                        border: '2px solid #333',
                        borderRadius: '8px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onDragOver={handleDragOver}
                >
                    {elements.map(element => (
                        <div
                            key={element.id}
                            draggable
                            onClick={() => handleSelect(element)}
                            onDragStart={(e) => handleDragStart(e, element)}
                            onDragEnd={handleDragEnd}
                            style={{
                                position: 'absolute',
                                left: element.x,
                                top: element.y,
                                width: defaultShapes[element.type].width,
                                height: defaultShapes[element.type].height,
                                fontSize: `${defaultShapes[element.type].height * 0.8}px`,
                                cursor: 'move',
                                transform: `rotate(${element.rotation}deg)`,
                                border: selectedElement?.id === element.id ? '2px dashed #4CAF50' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                userSelect: 'none'
                            }}
                        >
                            {defaultShapes[element.type].image}
                        </div>
                    ))}
                </div>

                {/* Controls for selected element */}
                {selectedElement && (
                    <div style={{ 
                        marginTop: '20px',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <button
                            onClick={() => handleRotate('left')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Rotate Left
                        </button>
                        <button
                            onClick={() => handleRotate('right')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Rotate Right
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Storyboard;