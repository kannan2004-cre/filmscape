/* import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  arrayUnion 
} from "firebase/firestore";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../Components/ui/Dialog';
import { Button } from "../Components/ui/button";
import { Dialog } from "../Components/ui/Dialog";
import { Input } from "../Components/ui/Input";
import { Label } from "../Components/ui/Label";
import { Select } from "../Components/ui/Select";

import { 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../Components/ui/Select';

function Collaboration({ projectId, scriptId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (projectId && isOpen) {
      fetchCollaborators();
    }
  }, [projectId, isOpen]);

  const fetchCollaborators = async () => {
    if (!userId || !projectId) return;
    
    try {
      setIsLoading(true);
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const project = userData.projects.find(p => p.projectName === projectId);
        
        if (project && project.collaborators) {
          setCollaborators(project.collaborators);
        } else {
          setCollaborators([]);
        }
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      setError("Failed to load collaborators");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Find user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("No user found with that email address");
        setIsLoading(false);
        return;
      }
      
      const collaboratorDoc = querySnapshot.docs[0];
      const collaboratorId = collaboratorDoc.id;
      const collaboratorData = collaboratorDoc.data();
      
      if (collaboratorId === userId) {
        setError("You can't add yourself as a collaborator");
        setIsLoading(false);
        return;
      }
      
      // Check if user is already a collaborator
      if (collaborators.some(c => c.userId === collaboratorId)) {
        setError("This user is already a collaborator");
        setIsLoading(false);
        return;
      }
      
      // 2. Update current user's project with new collaborator
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects.map(project => {
          if (project.projectName === projectId) {
            // Initialize collaborators array if it doesn't exist
            const currentCollaborators = project.collaborators || [];
            
            return {
              ...project,
              collaborators: [
                ...currentCollaborators,
                {
                  userId: collaboratorId,
                  name: collaboratorData.name || email,
                  email: email,
                  photoURL: collaboratorData.photoURL || null,
                  permission,
                  addedAt: new Date().toISOString()
                }
              ]
            };
          }
          return project;
        });
        
        await updateDoc(userRef, {
          projects: updatedProjects
        });
        
        // 3. Add project reference to collaborator's account
        const collaboratorRef = doc(db, "users", collaboratorId);
        const collaboratorDoc = await getDoc(collaboratorRef);
        
        if (collaboratorDoc.exists()) {
          const sharedProjectInfo = {
            projectName: projectId,
            permission,
            ownerId: userId,
            ownerName: userData.name || "Unknown",
            ownerEmail: userData.email || "Unknown",
            isShared: true,
            addedAt: new Date().toISOString()
          };
          
          // Check if the user already has a sharedProjects array
          if (!collaboratorDoc.data().sharedProjects) {
            await updateDoc(collaboratorRef, {
              sharedProjects: [sharedProjectInfo]
            });
          } else {
            await updateDoc(collaboratorRef, {
              sharedProjects: arrayUnion(sharedProjectInfo)
            });
          }
        }
        
        // 4. Update local state
        setCollaborators([
          ...collaborators,
          {
            userId: collaboratorId,
            name: collaboratorData.name || email,
            email: email,
            photoURL: collaboratorData.photoURL || null,
            permission,
            addedAt: new Date().toISOString()
          }
        ]);
        
        setSuccess(`Successfully shared project with ${email}`);
        setEmail('');
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setError("Failed to add collaborator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Remove collaborator from current user's project
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects.map(project => {
          if (project.projectName === projectId) {
            return {
              ...project,
              collaborators: (project.collaborators || []).filter(
                c => c.userId !== collaboratorId
              )
            };
          }
          return project;
        });
        
        await updateDoc(userRef, {
          projects: updatedProjects
        });
        
        // 2. Remove shared project from collaborator's account
        const collaboratorRef = doc(db, "users", collaboratorId);
        const collaboratorDoc = await getDoc(collaboratorRef);
        
        if (collaboratorDoc.exists() && collaboratorDoc.data().sharedProjects) {
          const updatedSharedProjects = collaboratorDoc.data().sharedProjects.filter(
            p => !(p.projectName === projectId && p.ownerId === userId)
          );
          
          await updateDoc(collaboratorRef, {
            sharedProjects: updatedSharedProjects
          });
        }
        
        // 3. Update local state
        setCollaborators(collaborators.filter(c => c.userId !== collaboratorId));
        setSuccess("Collaborator removed successfully");
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
      setError("Failed to remove collaborator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePermission = async (collaboratorId, newPermission) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Update permission in current user's project
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects.map(project => {
          if (project.projectName === projectId) {
            return {
              ...project,
              collaborators: (project.collaborators || []).map(c => 
                c.userId === collaboratorId ? { ...c, permission: newPermission } : c
              )
            };
          }
          return project;
        });
        
        await updateDoc(userRef, {
          projects: updatedProjects
        });
        
        // 2. Update permission in collaborator's shared projects
        const collaboratorRef = doc(db, "users", collaboratorId);
        const collaboratorDoc = await getDoc(collaboratorRef);
        
        if (collaboratorDoc.exists() && collaboratorDoc.data().sharedProjects) {
          const updatedSharedProjects = collaboratorDoc.data().sharedProjects.map(p => {
            if (p.projectName === projectId && p.ownerId === userId) {
              return { ...p, permission: newPermission };
            }
            return p;
          });
          
          await updateDoc(collaboratorRef, {
            sharedProjects: updatedSharedProjects
          });
        }
        
        // 3. Update local state
        setCollaborators(collaborators.map(c => 
          c.userId === collaboratorId ? { ...c, permission: newPermission } : c
        ));
        
        setSuccess("Permission updated successfully");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      setError("Failed to update permission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Share Project
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {error && (
              <div className="bg-red-100 text-red-800 p-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 text-green-800 p-2 rounded-md text-sm">
                {success}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <Label htmlFor="email">Add collaborator</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={permission} onValueChange={setPermission}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddCollaborator} 
                  disabled={isLoading || !email}
                >
                  Share
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-3 mt-4">
              <h3 className="font-medium mb-2">Current Collaborators</h3>
              {collaborators.length === 0 ? (
                <p className="text-sm text-gray-500">No collaborators yet</p>
              ) : (
                <ul className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <li key={collaborator.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {collaborator.photoURL ? (
                          <img 
                            src={collaborator.photoURL} 
                            alt={collaborator.name} 
                            className="w-8 h-8 rounded-full" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            {collaborator.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-sm text-gray-500">{collaborator.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={collaborator.permission}
                          onValueChange={(value) => handleChangePermission(collaborator.userId, value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View only</SelectItem>
                            <SelectItem value="edit">Can edit</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveCollaborator(collaborator.userId)}
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Collaboration; */