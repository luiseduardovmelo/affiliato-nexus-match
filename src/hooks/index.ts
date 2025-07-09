// Export all custom hooks
export { useAuth, testAuthTypes } from './useAuth';
export { 
  useUsers, 
  useOperators, 
  useAffiliates, 
  useUserById, 
  useUsersWithFilters, 
  testUserTypes 
} from './useUsers';
export { useRegistration } from './useRegistration';
export { useCurrentUser } from './useCurrentUser';

// Re-export existing hooks for consistency
export { default as useFavorites } from './useFavorites';
export { default as useRevealState } from './useRevealState';
export { default as useProfileData } from './useProfileData';
export { default as useDraggablePosition } from './useDraggablePosition';

// Run type tests in development
if (process.env.NODE_ENV === 'development') {
  import('./useAuth').then(({ testAuthTypes }) => {
    console.log('🧪 Running auth type tests...');
    testAuthTypes();
  });
  
  import('./useUsers').then(({ testUserTypes }) => {
    console.log('🧪 Running user type tests...');
    testUserTypes();
  });
}