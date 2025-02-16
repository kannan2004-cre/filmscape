import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar';

const defaultShapes = {
    // Characters
    actor: { width: 40, height: 80, zIndex: 3, image: '🧍', category: 'Characters' },
    actress: { width: 40, height: 80, zIndex: 3, image: '🧍‍♀️', category: 'Characters' },
    villain: { width: 40, height: 80, zIndex: 3, image: '🦹', category: 'Characters' },
    villain2: { width: 40, height: 80, zIndex: 3, image: '🦹‍♀️', category: 'Characters' },
    extraMale: { width: 35, height: 70, zIndex: 3, image: '👨', category: 'Characters' },
    extraFemale: { width: 35, height: 70, zIndex: 3, image: '👩', category: 'Characters' },
    policeman: { width: 40, height: 80, zIndex: 3, image: '👮', category: 'Characters' },
    detective: { width: 40, height: 80, zIndex: 3, image: '🕵️', category: 'Characters' },
    
    // Equipment
    camera: { width: 50, height: 30, zIndex: 2, image: '📹', category: 'Equipment' },
    microphone: { width: 30, height: 60, zIndex: 2, image: '🎤', category: 'Equipment' },
    lights: { width: 40, height: 60, zIndex: 2, image: '💡', category: 'Equipment' },
    tripod: { width: 30, height: 50, zIndex: 2, image: '🔭', category: 'Equipment' },
    spotlight: { width: 40, height: 40, zIndex: 2, image: '🔦', category: 'Equipment' },
    
    // Buildings & Sets
    building1: { width: 100, height: 150, zIndex: 1, image: '🏢', category: 'Buildings and Sets' },
    building2: { width: 100, height: 120, zIndex: 1, image: '🏬', category: 'Buildings and Sets' },
    building3: { width: 100, height: 130, zIndex: 1, image: '🏗️', category: 'Buildings and Sets' },
    house: { width: 90, height: 90, zIndex: 1, image: '🏠', category: 'Buildings and Sets' },
    mansion: { width: 110, height: 110, zIndex: 1, image: '🏰', category: 'Buildings and Sets' },
    warehouse: { width: 100, height: 100, zIndex: 1, image: '🏭', category: 'Buildings and Sets' },
    hospital: { width: 100, height: 140, zIndex: 1, image: '🏥', category: 'Buildings and Sets' },
    
    // Rooms
    livingRoom: { width: 120, height: 80, zIndex: 1, image: '🛋️', category: 'Rooms' },
    bedroom: { width: 100, height: 70, zIndex: 1, image: '🛏️', category: 'Rooms' },
    kitchen: { width: 100, height: 70, zIndex: 1, image: '🍳', category: 'Rooms' },
    office: { width: 100, height: 70, zIndex: 1, image: '💼', category: 'Rooms' },
    laboratory: { width: 100, height: 70, zIndex: 1, image: '🧪', category: 'Rooms' },
    jail: { width: 90, height: 70, zIndex: 1, image: '🏛️', category: 'Rooms' },
    
    // Props & Furniture
    chair: { width: 30, height: 40, zIndex: 2, image: '🪑', category: 'Props' },
    table: { width: 50, height: 30, zIndex: 2, image: '🪟', category: 'Props' },
    car: { width: 80, height: 40, zIndex: 2, image: '🚗', category: 'Props' },
    policecar: { width: 80, height: 40, zIndex: 2, image: '🚓', category: 'Props' },
    gun: { width: 40, height: 20, zIndex: 2, image: '🔫', category: 'Props' },
    knife: { width: 30, height: 20, zIndex: 2, image: '🔪', category: 'Props' },
    phone: { width: 20, height: 30, zIndex: 2, image: '📱', category: 'Props' },
    computer: { width: 40, height: 30, zIndex: 2, image: '💻', category: 'Props' },
    briefcase: { width: 30, height: 30, zIndex: 2, image: '💼', category: 'Props' },
    book: { width: 25, height: 30, zIndex: 2, image: '📚', category: 'Props' },
    money: { width: 30, height: 20, zIndex: 2, image: '💰', category: 'Props' },
    prop: { width: 30, height: 30, zIndex: 2, image: '📦', category: 'Props' },
    
    // Nature & Environment
    tree: { width: 60, height: 80, zIndex: 1, image: '🌳', category: 'Environment' },
    bush: { width: 40, height: 40, zIndex: 1, image: '🌿', category: 'Environment' },
    rock: { width: 35, height: 35, zIndex: 1, image: '🪨', category: 'Environment' },
    flower: { width: 25, height: 35, zIndex: 1, image: '🌸', category: 'Environment' },
    moon: { width: 50, height: 50, zIndex: 1, image: '🌕', category: 'Environment' },
    cloud: { width: 45, height: 30, zIndex: 1, image: '☁️', category: 'Environment' }
};

const categories = ['Characters', 'Equipment', 'Buildings and Sets', 'Rooms', 'Props', 'Environment'];

const Storyboard = () => {
    const [elements, setElements] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Characters');
    const [selectedElement, setSelectedElement] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState(null);
    const canvasRef = useRef(null);
    const initialResizeDataRef = useRef(null);

    const handleAddElement = (type) => {
        const newElement = {
            id: Date.now().toString(),
            type,
            x: 200,
            y: 150,
            rotation: 0,
            width: defaultShapes[type].width,
            height: defaultShapes[type].height,
            zIndex: defaultShapes[type].zIndex
        };
        setElements([...elements, newElement]);
    };

    const handleDragStart = (e, element) => {
        if (isResizing) {
            e.preventDefault();
            return;
        }
        setDraggedElement(element);
        setSelectedElement(element);
        // Store initial position for accurate dragging
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        e.dataTransfer.setData('text/plain', element.id);
        e.dataTransfer.effectAllowed = 'move';
        
        // Set drag image to be transparent
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
        
        // Store offset in the draggedElement
        setDraggedElement({
            ...element,
            offsetX,
            offsetY
        });
        
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        if (draggedElement && !isResizing) {
            e.target.style.opacity = '1';
            const canvasRect = canvasRef.current.getBoundingClientRect();
            
            const updatedElements = elements.map(el => {
                if (el.id === draggedElement.id) {
                    return {
                        ...el,
                        x: e.clientX - canvasRect.left - (draggedElement.offsetX || el.width / 2),
                        y: e.clientY - canvasRect.top - (draggedElement.offsetY || el.height / 2)
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            
            // Update selected element
            const updatedElement = updatedElements.find(el => el.id === draggedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
        setDraggedElement(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (draggedElement && !isResizing) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            
            // Update the element position during drag
            const updatedElements = elements.map(el => {
                if (el.id === draggedElement.id) {
                    return {
                        ...el,
                        x: e.clientX - canvasRect.left - (draggedElement.offsetX || el.width / 2),
                        y: e.clientY - canvasRect.top - (draggedElement.offsetY || el.height / 2)
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            
            // Update selected element
            const updatedElement = updatedElements.find(el => el.id === draggedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleSelect = (e, element) => {
        e.stopPropagation();
        if (!isResizing) {
            setSelectedElement(selectedElement?.id === element.id ? null : element);
        }
    };

    const handleCanvasClick = () => {
        if (!isResizing) {
            setSelectedElement(null);
        }
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
            
            // Update selected element
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleResizeStart = (e, element, direction) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        setResizeDirection(direction);
        
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // Get initial positions and dimensions
        initialResizeDataRef.current = {
            id: element.id,
            initialX: e.clientX,
            initialY: e.clientY,
            initialWidth: element.width,
            initialHeight: element.height,
            initialLeft: element.x,
            initialTop: element.y,
            canvasLeft: canvasRect.left,
            canvasTop: canvasRect.top
        };
        
        // Set up global mouse move and mouse up handlers
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResizeMove = (e) => {
        if (!isResizing || !initialResizeDataRef.current) return;
        
        const data = initialResizeDataRef.current;
        const deltaX = e.clientX - data.initialX;
        const deltaY = e.clientY - data.initialY;
        
        let newWidth = data.initialWidth;
        let newHeight = data.initialHeight;
        let newX = data.initialLeft;
        let newY = data.initialTop;

        // Adjust dimensions and position based on resize direction
        switch (resizeDirection) {
            case 'n':
                newHeight = Math.max(20, data.initialHeight - deltaY);
                newY = data.initialTop + data.initialHeight - newHeight;
                break;
            case 's':
                newHeight = Math.max(20, data.initialHeight + deltaY);
                break;
            case 'w':
                newWidth = Math.max(20, data.initialWidth - deltaX);
                newX = data.initialLeft + data.initialWidth - newWidth;
                break;
            case 'e':
                newWidth = Math.max(20, data.initialWidth + deltaX);
                break;
            case 'nw':
                newWidth = Math.max(20, data.initialWidth - deltaX);
                newHeight = Math.max(20, data.initialHeight - deltaY);
                newX = data.initialLeft + data.initialWidth - newWidth;
                newY = data.initialTop + data.initialHeight - newHeight;
                break;
            case 'ne':
                newWidth = Math.max(20, data.initialWidth + deltaX);
                newHeight = Math.max(20, data.initialHeight - deltaY);
                newY = data.initialTop + data.initialHeight - newHeight;
                break;
            case 'sw':
                newWidth = Math.max(20, data.initialWidth - deltaX);
                newHeight = Math.max(20, data.initialHeight + deltaY);
                newX = data.initialLeft + data.initialWidth - newWidth;
                break;
            case 'se':
                newWidth = Math.max(20, data.initialWidth + deltaX);
                newHeight = Math.max(20, data.initialHeight + deltaY);
                break;
            default:
                break;
        }

        // Update the elements array with new dimensions and position
        const updatedElements = elements.map(el => {
            if (el.id === data.id) {
                return {
                    ...el,
                    width: newWidth,
                    height: newHeight,
                    x: newX,
                    y: newY
                };
            }
            return el;
        });
        
        setElements(updatedElements);
        
        // Update selected element
        const updatedElement = updatedElements.find(el => el.id === data.id);
        if (updatedElement) {
            setSelectedElement(updatedElement);
        }
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
        setResizeDirection(null);
        initialResizeDataRef.current = null;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    const handleDelete = () => {
        if (selectedElement) {
            const updatedElements = elements.filter(el => el.id !== selectedElement.id);
            setElements(updatedElements);
            setSelectedElement(null);
        }
    };

    // Sort elements by zIndex to render them in the correct order
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212' }}>
            <Navbar />
            <div style={{ display: 'flex', padding: '20px', flex: 1 }}>
                {/* Toolbar */}
                <div style={{ 
                    width: '200px',
                    backgroundColor: '#1e1e1e',
                    padding: '20px',
                    marginRight: '20px',
                    borderRadius: '8px',
                    height: 'fit-content'
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
                        ref={canvasRef}
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
                        onClick={handleCanvasClick}
                        onDragOver={handleDragOver}
                    >
                        {sortedElements.map(element => (
                            <div
                                key={element.id}
                                draggable={!isResizing}
                                onClick={(e) => handleSelect(e, element)}
                                onDragStart={(e) => handleDragStart(e, element)}
                                onDragEnd={handleDragEnd}
                                style={{
                                    position: 'absolute',
                                    left: element.x,
                                    top: element.y,
                                    width: element.width,
                                    height: element.height,
                                    fontSize: `${Math.min(element.width, element.height) * 0.8}px`,
                                    cursor: isResizing ? 'auto' : 'move',
                                    transform: `rotate(${element.rotation}deg)`,
                                    border: selectedElement?.id === element.id ? '2px dashed #4CAF50' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    userSelect: 'none',
                                    zIndex: element.zIndex
                                }}
                            >
                                {defaultShapes[element.type].image}
                                
                                {/* Render resize handles when element is selected */}
                                {selectedElement?.id === element.id && (
                                    <>
                                        {/* Top handle */}
                                        <div
                                            className="resize-handle n"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'n')}
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'n-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Bottom handle */}
                                        <div
                                            className="resize-handle s"
                                            onMouseDown={(e) => handleResizeStart(e, element, 's')}
                                            style={{
                                                position: 'absolute',
                                                bottom: -5,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 's-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Left handle */}
                                        <div
                                            className="resize-handle w"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'w')}
                                            style={{
                                                position: 'absolute',
                                                left: -5,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'w-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Right handle */}
                                        <div
                                            className="resize-handle e"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'e')}
                                            style={{
                                                position: 'absolute',
                                                right: -5,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'e-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Top-left handle */}
                                        <div
                                            className="resize-handle nw"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'nw')}
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                left: -5,
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'nw-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Top-right handle */}
                                        <div
                                            className="resize-handle ne"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'ne')}
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'ne-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Bottom-left handle */}
                                        <div
                                            className="resize-handle sw"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'sw')}
                                            style={{
                                                position: 'absolute',
                                                bottom: -5,
                                                left: -5,
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'sw-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                        
                                        {/* Bottom-right handle */}
                                        <div
                                            className="resize-handle se"
                                            onMouseDown={(e) => handleResizeStart(e, element, 'se')}
                                            style={{
                                                position: 'absolute',
                                                bottom: -5,
                                                right: -5,
                                                width: 10,
                                                height: 10,
                                                background: '#4CAF50',
                                                borderRadius: '50%',
                                                cursor: 'se-resize',
                                                zIndex: 1000
                                            }}
                                        />
                                    </>
                                )}
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
                            <button
                                onClick={handleDelete}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: 'auto'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Storyboard;