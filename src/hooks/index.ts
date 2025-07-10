
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
export { useSecureAuth } from './useSecureAuth';

// Re-export existing hooks with proper imports (not default imports)
export { useIsFavorite, useToggleFavorite } from './useFavorites';
export { useRevealState } from './useRevealState';
export { useProfileData } from './useProfileData';
export { useDraggablePosition } from './useDraggablePosition';

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
