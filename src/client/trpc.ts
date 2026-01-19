import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/router.js';

// This creates the hooks (useQuery, useMutation) with your backend's types!
export const trpc = createTRPCReact<AppRouter>();