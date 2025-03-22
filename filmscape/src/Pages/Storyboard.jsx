import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebaseConfig'; // Ensure this path is correct
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import Navbar from '../Components/Navbar';
import html2canvas from 'html2canvas'; // Import html2canvas for capturing the canvas
import { toast } from 'react-toastify'; // Import toast for notifications

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
    const canvasRef = useRef(null);
    const resizeStartRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnPaths, setDrawnPaths] = useState([]);
    const [isErasing, setIsErasing] = useState(false);
    const [gradient, setGradient] = useState({ color1: '#ffffff', color2: '#000000', direction: 'to right' });
    const [shadow, setShadow] = useState({ color: '#000000', offsetX: 5, offsetY: 5, blur: 10 });
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [scenes, setScenes] = useState([]);
    const [currentScene, setCurrentScene] = useState(null);
    const [showSceneModal, setShowSceneModal] = useState(false);
    const [newSceneName, setNewSceneName] = useState("");
    const [showLoadScriptsModal, setShowLoadScriptsModal] = useState(false);
    const [selectedLoadProject, setSelectedLoadProject] = useState("");
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);

    const user = auth.currentUser;
    let userId;
    if (user != null) {
        userId = user.uid;
    }

    useEffect(() => {
        if (userId) {
            fetchProjects();
        }
    }, [userId]);

    const fetchProjects = async () => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setProjects(userData.projects || []);
            }
        } catch (error) {
            console.log("Error fetching projects:", error);
        }
    };

    const handleAddElement = (type) => {
        const newElement = {
            id: Date.now().toString(),
            type,
            x: 200,
            y: 150,
            rotation: 0,
            width: defaultShapes[type].width,
            height: defaultShapes[type].height,
            zIndex: defaultShapes[type].zIndex,
            opacity: 1,
            scale: 1,
            lockAspectRatio: true // Default to locked aspect ratio
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
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        e.dataTransfer.setData('text/plain', element.id);
        e.dataTransfer.effectAllowed = 'move';
        
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
        
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
            
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleDelete = () => {
        if (selectedElement) {
            const updatedElements = elements.filter(el => el.id !== selectedElement.id);
            setElements(updatedElements);
            setSelectedElement(null);
        }
    };

    const calculateResizedElement = (element, mouseX, mouseY, handle) => {
        const startData = resizeStartRef.current;
        if (!startData) return element;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const currentX = mouseX - canvasRect.left;
        const currentY = mouseY - canvasRect.top;

        // Calculate the rotation in radians
        const rotationRad = (element.rotation * Math.PI) / 180;
        const cosTheta = Math.cos(rotationRad);
        const sinTheta = Math.sin(rotationRad);

        // Calculate the change in mouse position
        const dx = currentX - startData.mouseX;
        const dy = currentY - startData.mouseY;

        // Rotate the mouse movement to align with the element's rotation
        const rotatedDX = dx * cosTheta + dy * sinTheta;
        const rotatedDY = -dx * sinTheta + dy * cosTheta;

        let newWidth = element.width;
        let newHeight = element.height;
        let newX = element.x;
        let newY = element.y;

        // Calculate the center point
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;

        // Handle aspect ratio lock
        const aspectRatio = startData.width / startData.height;
        const lockAspectRatio = element.lockAspectRatio;

        const updateDimensions = (deltaWidth, deltaHeight, anchorX, anchorY) => {
            if (lockAspectRatio) {
                // Use the larger change to maintain aspect ratio
                const scaleFactor = Math.abs(deltaWidth / startData.width) > Math.abs(deltaHeight / startData.height)
                    ? Math.abs(deltaWidth / startData.width)
                    : Math.abs(deltaHeight / startData.height);
                
                deltaWidth = startData.width * scaleFactor * Math.sign(deltaWidth);
                deltaHeight = startData.height * scaleFactor * Math.sign(deltaHeight);
            }

            // Update width and height
            newWidth = Math.max(20, startData.width + deltaWidth);
            newHeight = Math.max(20, startData.height + deltaHeight);

            // Calculate position adjustments based on anchor point
            if (anchorX !== 0 || anchorY !== 0) {
                const dw = newWidth - startData.width;
                const dh = newHeight - startData.height;
                
                // Calculate position adjustments in rotated space
                const adjustX = (dw * anchorX * cosTheta - dh * anchorY * sinTheta) / 2;
                const adjustY = (dw * anchorX * sinTheta + dh * anchorY * cosTheta) / 2;
                
                newX = startData.x - adjustX;
                newY = startData.y - adjustY;
            }
        };

        switch (handle) {
            case 'n':
                updateDimensions(0, -rotatedDY, 0, 1);
                break;
            case 's':
                updateDimensions(0, rotatedDY, 0, -1);
                break;
            case 'e':
                updateDimensions(rotatedDX, 0, -1, 0);
                break;
            case 'w':
                updateDimensions(-rotatedDX, 0, 1, 0);
                break;
            case 'nw':
                updateDimensions(-rotatedDX, -rotatedDY, 1, 1);
                break;
            case 'ne':
                updateDimensions(rotatedDX, -rotatedDY, -1, 1);
                break;
            case 'sw':
                updateDimensions(-rotatedDX, rotatedDY, 1, -1);
                break;
            case 'se':
                updateDimensions(rotatedDX, rotatedDY, -1, -1);
                break;
            default:
                break;
        }

        return {
            ...element,
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY
        };
    };

    const handleResizeStart = (e, element, handle) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;

        resizeStartRef.current = {
            handle,
            width: element.width,
            height: element.height,
            x: element.x,
            y: element.y,
            mouseX: e.clientX - canvasRect.left,
            mouseY: e.clientY - canvasRect.top,
            centerX,
            centerY
        };

        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResizeMove = (e) => {
        if (!isResizing || !resizeStartRef.current) return;

        const updatedElements = elements.map(el => {
            if (el.id === selectedElement.id) {
                return calculateResizedElement(el, e.clientX, e.clientY, resizeStartRef.current.handle);
            }
            return el;
        });

        setElements(updatedElements);
        const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
        if (updatedElement) {
            setSelectedElement(updatedElement);
        }
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
        resizeStartRef.current = null;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    const ResizeHandle = ({ position, cursor, onMouseDown }) => (
        <div
            className={`resize-handle ${position}`}
            onMouseDown={onMouseDown}
            style={{
                position: 'absolute',
                width: 10,
                height: 10,
                background: '#4CAF50',
                borderRadius: '50%',
                cursor,
                zIndex: 1000,
                ...getHandlePosition(position)
            }}
        />
    );

    const getHandlePosition = (position) => {
        const positions = {
            n: { top: -5, left: '50%', transform: 'translateX(-50%)' },
            s: { bottom: -5, left: '50%', transform: 'translateX(-50%)' },
            e: { right: -5, top: '50%', transform: 'translateY(-50%)' },
            w: { left: -5, top: '50%', transform: 'translateY(-50%)' },
            nw: { top: -5, left: -5 },
            ne: { top: -5, right: -5 },
            sw: { bottom: -5, left: -5 },
            se: { bottom: -5, right: -5 }
        };
        return positions[position];
    };

    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    const handleMouseDown = (e) => {
        if (!isResizing && !selectedElement) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const startX = e.clientX - canvasRect.left;
            const startY = e.clientY - canvasRect.top;

            if (isErasing) {
                erasePath(startX, startY);
            } else {
                setIsDrawing(true);
                setDrawnPaths([...drawnPaths, [{ x: startX, y: startY }]]);
            }
        }
    };

    const handleMouseMove = (e) => {
        if (isDrawing || isErasing) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const currentX = e.clientX - canvasRect.left;
            const currentY = e.clientY - canvasRect.top;

            if (isDrawing) {
                const updatedPaths = [...drawnPaths];
                const currentPath = updatedPaths[updatedPaths.length - 1];
                currentPath.push({ x: currentX, y: currentY });
                setDrawnPaths(updatedPaths);
            } else if (isErasing) {
                erasePath(currentX, currentY);
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
        }
    };

    const erasePath = (x, y) => {
        const eraserRadius = 10; // Define the size of the eraser
        const updatedPaths = drawnPaths.map(path => {
            const newPath = [];
            let isErasingSegment = false;

            for (let i = 0; i < path.length; i++) {
                const point = path[i];
                const distance = Math.hypot(point.x - x, point.y - y);

                if (distance > eraserRadius) {
                    if (isErasingSegment) {
                        // If we were erasing, start a new segment
                        newPath.push({ ...point });
                        isErasingSegment = false;
                    } else {
                        // Continue the current segment
                        newPath.push(point);
                    }
                } else {
                    // We are within the eraser radius, so skip this point
                    isErasingSegment = true;
                }
            }

            return newPath;
        }).filter(path => path.length > 0);

        setDrawnPaths(updatedPaths);
    };

    const toggleEraser = () => {
        setIsErasing(!isErasing);
    };

    const clearCanvas = () => {
        setDrawnPaths([]);
        setElements([]);
    };

    const StyleControls = ({ element }) => {
        if (!element) return null;
        
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '15px',
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                marginTop: '20px'
            }}>
                {/* Existing opacity and scale controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: 'white' }}>Opacity:</label>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={element.opacity}
                        onChange={(e) => handleOpacityChange(e.target.value)}
                        style={{ width: '100px' }}
                    />
                    <span style={{ color: 'white' }}>{(element.opacity * 100).toFixed(0)}%</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: 'white' }}>Scale:</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={element.scale}
                        onChange={(e) => handleScaleChange(e.target.value)}
                        style={{ width: '100px' }}
                    />
                    <span style={{ color: 'white' }}>{(element.scale * 100).toFixed(0)}%</span>
                </div>

                {/* Direct size controls with number input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: 'white' }}>Width:</label>
                    <input
                        type="number"
                        value={Math.round(element.width)}
                        onChange={(e) => handleSizeChange(e.target.value, 'width')}
                        style={{
                            width: '60px',
                            padding: '4px',
                            backgroundColor: '#1e1e1e',
                            color: 'white',
                            border: '1px solid #444',
                            borderRadius: '4px'
                        }}
                    />
                    <label style={{ color: 'white', marginLeft: '10px' }}>Height:</label>
                    <input
                        type="number"
                        value={Math.round(element.height)}
                        onChange={(e) => handleSizeChange(e.target.value, 'height')}
                        style={{
                            width: '60px',
                            padding: '4px',
                            backgroundColor: '#1e1e1e',
                            color: 'white',
                            border: '1px solid #444',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                {/* Add aspect ratio lock toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ color: 'white' }}>Lock Aspect Ratio:</label>
                    <input
                        type="checkbox"
                        checked={element.lockAspectRatio}
                        onChange={handleToggleAspectRatio}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>
        );
    };

    const handleSizeChange = (value, dimension) => {
        if (selectedElement) {
            const numValue = Math.max(20, parseInt(value) || 20); // Minimum size of 20px
            
            const updatedElements = elements.map(el => {
                if (el.id === selectedElement.id) {
                    if (el.lockAspectRatio) {
                        // If aspect ratio is locked, adjust both dimensions proportionally
                        const aspectRatio = el.width / el.height;
                        if (dimension === 'width') {
                            return {
                                ...el,
                                width: numValue,
                                height: Math.round(numValue / aspectRatio)
                            };
                        } else {
                            return {
                                ...el,
                                height: numValue,
                                width: Math.round(numValue * aspectRatio)
                            };
                        }
                    } else {
                        // If aspect ratio is not locked, adjust only the specified dimension
                        return {
                            ...el,
                            [dimension]: numValue
                        };
                    }
                }
                return el;
            });
            
            setElements(updatedElements);
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleToggleAspectRatio = () => {
        if (selectedElement) {
            const updatedElements = elements.map(el => {
                if (el.id === selectedElement.id) {
                    return {
                        ...el,
                        lockAspectRatio: !el.lockAspectRatio
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleOpacityChange = (value) => {
        if (selectedElement) {
            const updatedElements = elements.map(el => {
                if (el.id === selectedElement.id) {
                    return {
                        ...el,
                        opacity: parseFloat(value)
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleScaleChange = (value) => {
        if (selectedElement) {
            const updatedElements = elements.map(el => {
                if (el.id === selectedElement.id) {
                    return {
                        ...el,
                        scale: parseFloat(value)
                    };
                }
                return el;
            });
            
            setElements(updatedElements);
            const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
            if (updatedElement) {
                setSelectedElement(updatedElement);
            }
        }
    };

    const handleGradientChange = (field, value) => {
        setGradient(prev => ({ ...prev, [field]: value }));
    };

    const handleShadowChange = (field, value) => {
        setShadow(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveScene = () => {
        if (projects.length > 0) {
            setShowSceneModal(true); // Show scene selection modal
        } else {
            setShowNewProjectModal(true); // Show new project creation modal
        }
    };

    const flattenDrawnPaths = (paths) => {
        return paths.map((path, pathIndex) => 
            path.map(point => ({ ...point, pathIndex }))
        ).flat();
    };

    const reconstructDrawnPaths = (flatPaths) => {
        const paths = [];
        flatPaths.forEach(point => {
            if (!paths[point.pathIndex]) {
                paths[point.pathIndex] = [];
            }
            paths[point.pathIndex].push({ x: point.x, y: point.y });
        });
        return paths;
    };

    const saveSceneToProject = async () => {
        if (!selectedProject || !newSceneName.trim() || (elements.length === 0 && drawnPaths.length === 0)) return;
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedProjects = userData.projects.map((project) => {
                    if (project.projectName === selectedProject) {
                        let sceneExists = false;
                        const updatedScenes = (project.scenes || []).map((scene) => {
                            if (scene.sceneName === newSceneName) {
                                sceneExists = true;
                                if (window.confirm(`A scene named "${newSceneName}" already exists. Do you want to replace it?`)) {
                                    return {
                                        ...scene,
                                        sceneName: newSceneName, // Assign the scene name entered by the user
                                        elements,
                                        drawnPaths: flattenDrawnPaths(drawnPaths), // Save flattened drawn paths
                                        lastModified: new Date().toISOString(),
                                    };
                                } else {
                                    return scene;
                                }
                            }
                            return scene;
                        });

                        if (!sceneExists) {
                            updatedScenes.push({
                                sceneName: newSceneName, // Assign the scene name entered by the user
                                elements,
                                drawnPaths: flattenDrawnPaths(drawnPaths), // Save flattened drawn paths
                                createdAt: new Date().toISOString(),
                                lastModified: new Date().toISOString(),
                            });
                        }

                        return {
                            ...project,
                            scenes: updatedScenes,
                        };
                    }
                    return project;
                });
                await updateDoc(userRef, {
                    projects: updatedProjects,
                });
                setNewSceneName("");
                setSelectedProject("");
                setShowSceneModal(false);
                setProjects(updatedProjects);
                setCurrentScene(null);
            }
        } catch (error) {
            console.log("Error saving scene:", error);
        }
    };

    const saveEditedScene = async () => {
        if (!currentScene || !currentScene.sceneName) return;
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedProjects = userData.projects.map((project) => {
                    if (project.projectName === selectedProject) {
                        const updatedScenes = (project.scenes || []).map((scene) => {
                            if (scene.sceneName === currentScene.sceneName) {
                                return {
                                    ...scene,
                                    elements,
                                    drawnPaths: flattenDrawnPaths(drawnPaths),
                                    lastModified: new Date().toISOString(),
                                };
                            }
                            return scene;
                        });

                        return {
                            ...project,
                            scenes: updatedScenes,
                        };
                    }
                    return project;
                });
                await updateDoc(userRef, {
                    projects: updatedProjects,
                });
                setProjects(updatedProjects);
                setCurrentScene(null);
                toast.success("Scene saved successfully!"); // Show toast notification
            }
        } catch (error) {
            console.log("Error saving edited scene:", error);
        }
    };

    const loadScene = async () => {
        setShowLoadScriptsModal(true);
    };

    const handleProjectSelection = (projectName) => {
        const project = projects.find(p => p.projectName === projectName);
        if (project) {
            setScenes(project.scenes || []);
        }
    };

    const handleLoadScene = (scene) => {
        setElements(scene.elements);
        setDrawnPaths(reconstructDrawnPaths(scene.drawnPaths || [])); // Load and reconstruct drawn paths
        setCurrentScene(scene);
        setShowLoadScriptsModal(false);
    };

    const downloadSceneAsJPG = () => {
        const canvasArea = document.getElementById('canvas-area');
        html2canvas(canvasArea).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'scene.jpg';
            link.click();
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212' }}>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', flex: 1 }}>
                {/* Save and Load Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <button onClick={handleSaveScene} style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Save Scene
                    </button>
                    <button onClick={loadScene} style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Load Scene
                    </button>
                    <button onClick={downloadSceneAsJPG} style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Download as JPG
                    </button>
                    <button onClick={saveEditedScene} style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Save Edited Scene
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'flex', flex: 1 }}>
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
                        <button
                            onClick={toggleEraser}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '15px',
                                backgroundColor: isErasing ? '#f44336' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {isErasing ? 'Switch to Draw' : 'Switch to Erase'}
                        </button>
                        <button
                            onClick={clearCanvas}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '10px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear Entire Canvas
                        </button>

                        {/* Gradient Controls */}
                        <div style={{ marginTop: '20px' }}>
                            <label style={{ color: 'white' }}>Gradient Color 1:</label>
                            <input
                                type="color"
                                value={gradient.color1}
                                onChange={(e) => handleGradientChange('color1', e.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <label style={{ color: 'white' }}>Gradient Color 2:</label>
                            <input
                                type="color"
                                value={gradient.color2}
                                onChange={(e) => handleGradientChange('color2', e.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <label style={{ color: 'white' }}>Gradient Direction:</label>
                            <select
                                value={gradient.direction}
                                onChange={(e) => handleGradientChange('direction', e.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            >
                                <option value="to right">To Right</option>
                                <option value="to left">To Left</option>
                                <option value="to top">To Top</option>
                                <option value="to bottom">To Bottom</option>
                                <option value="to top right">To Top Right</option>
                                <option value="to top left">To Top Left</option>
                                <option value="to bottom right">To Bottom Right</option>
                                <option value="to bottom left">To Bottom Left</option>
                            </select>
                        </div>

                        {/* Shadow Controls */}
                        <div style={{ marginTop: '20px' }}>
                            <label style={{ color: 'white' }}>Shadow Color:</label>
                            <input
                                type="color"
                                value={shadow.color}
                                onChange={(e) => handleShadowChange('color', e.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <label style={{ color: 'white' }}>Offset X:</label>
                            <input
                                type="number"
                                value={shadow.offsetX}
                                onChange={(e) => handleShadowChange('offsetX', parseInt(e.target.value))}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <label style={{ color: 'white' }}>Offset Y:</label>
                            <input
                                type="number"
                                value={shadow.offsetY}
                                onChange={(e) => handleShadowChange('offsetY', parseInt(e.target.value))}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <label style={{ color: 'white' }}>Blur:</label>
                            <input
                                type="number"
                                value={shadow.blur}
                                onChange={(e) => handleShadowChange('blur', parseInt(e.target.value))}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Style Controls just below the toolbar */}
                        <StyleControls element={selectedElement} />

                        <div 
                            ref={canvasRef}
                            id="canvas-area"
                            style={{
                                width: '800px',
                                height: '500px',
                                background: `linear-gradient(${gradient.direction}, ${gradient.color1}, ${gradient.color2})`,
                                border: '2px solid #333',
                                borderRadius: '8px',
                                position: 'relative',
                                overflow: 'hidden',
                                marginTop: '20px'
                            }}
                            onClick={handleCanvasClick}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onDragOver={handleDragOver}
                        >
                            {/* Render drawn paths */}
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                {drawnPaths.map((path, index) => (
                                    <polyline
                                        key={index}
                                        points={path.map(p => `${p.x},${p.y}`).join(' ')}
                                        style={{
                                            fill: 'none',
                                            stroke: 'black',
                                            strokeWidth: 2,
                                            filter: `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color})`
                                        }}
                                    />
                                ))}
                            </svg>
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
                                    
                                    {selectedElement?.id === element.id && (
                                        <>
                                            <ResizeHandle position="n" cursor="n-resize" 
                                                onMouseDown={(e) => handleResizeStart(e, element, 'n')} />
                                            <ResizeHandle position="s" cursor="s-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 's')} />
                                            <ResizeHandle position="e" cursor="e-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'e')} />
                                            <ResizeHandle position="w" cursor="w-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'w')} />
                                            <ResizeHandle position="nw" cursor="nw-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'nw')} />
                                            <ResizeHandle position="ne" cursor="ne-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'ne')} />
                                            <ResizeHandle position="sw" cursor="sw-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'sw')} />
                                            <ResizeHandle position="se" cursor="se-resize"
                                                onMouseDown={(e) => handleResizeStart(e, element, 'se')} />
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

                        {/* Scene Modal */}
                        {showSceneModal && (
                            <div className="modal">
                                <h2>Select Project</h2>
                                <select
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    value={selectedProject}
                                >
                                    <option value="" className="option">Select a project</option>
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.projectName}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Enter scene name"
                                    value={newSceneName}
                                    onChange={(e) => setNewSceneName(e.target.value)}
                                />
                                <button onClick={saveSceneToProject}>Save Scene</button>
                                <button onClick={() => setShowSceneModal(false)}>Cancel</button>
                            </div>
                        )}

                        {/* Load Scenes Modal */}
                        {showLoadScriptsModal && (
                            <div className="modal">
                                <h2>Select Project to Load Scenes</h2>
                                <select
                                    onChange={(e) => {
                                        setSelectedLoadProject(e.target.value);
                                        handleProjectSelection(e.target.value);
                                    }}
                                    value={selectedLoadProject}
                                >
                                    <option value="" className="option">Select a project</option>
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.projectName}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                                {scenes.length > 0 && (
                                    <div>
                                        <h3>Select Scene</h3>
                                        <ul>
                                            {scenes.map((scene, index) => (
                                                <li key={index}>
                                                    {scene.sceneName}
                                                    <button onClick={() => handleLoadScene(scene)}>Load</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <button onClick={() => setShowLoadScriptsModal(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Storyboard;