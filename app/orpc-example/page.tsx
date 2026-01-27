'use client';

import { orpcQuery } from '@/lib/orpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function ORPCTestPage() {
  const [message, setMessage] = useState('Hello from the frontend!');

  // Example 1: Use useQuery to call /hello endpoint (POST method in server, but used as query)
  const helloQuery = useQuery(orpcQuery.hello.queryOptions());

  // Example 2: Use useMutation to call /echo endpoint
  const echoMutation = useMutation(orpcQuery.echo.mutationOptions());

  const handleEcho = () => {
    echoMutation.mutate({ message });
  };

  return (
    <div className='container mx-auto py-10 space-y-6'>
      {/* Example 1: useQuery with /hello endpoint */}
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>Example 1: useQuery with /hello</CardTitle>
          <CardDescription>
            Using useQuery to call /hello endpoint (POST method, but used as query)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {helloQuery.isPending && (
            <div className='p-4 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 rounded-md'>
              <p className='font-semibold'>Loading...</p>
            </div>
          )}

          {helloQuery.isError && (
            <div className='p-4 bg-destructive/10 text-destructive rounded-md'>
              <p className='font-semibold'>Error:</p>
              <p className='text-sm'>{helloQuery.error.message}</p>
            </div>
          )}

          {helloQuery.isSuccess && (
            <div className='p-4 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 rounded-md'>
              <p className='font-semibold'>Response:</p>
              <pre className='text-sm mt-1 overflow-auto'>
                {JSON.stringify(helloQuery.data, null, 2)}
              </pre>
            </div>
          )}

          <div className='pt-4 border-t'>
            <h3 className='text-sm font-semibold mb-2'>Query Status:</h3>
            <ul className='text-sm space-y-1'>
              <li>isPending: {helloQuery.isPending.toString()}</li>
              <li>isLoading: {helloQuery.isLoading.toString()}</li>
              <li>isFetching: {helloQuery.isFetching.toString()}</li>
              <li>isError: {helloQuery.isError.toString()}</li>
              <li>isSuccess: {helloQuery.isSuccess.toString()}</li>
            </ul>
          </div>

          <Button onClick={() => helloQuery.refetch()} className='w-full' variant='outline'>
            Refetch Hello
          </Button>
        </CardContent>
      </Card>

      {/* Example 2: useMutation with /echo endpoint */}
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>Example 2: useMutation with /echo</CardTitle>
          <CardDescription>Using useMutation to call /echo endpoint</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='message' className='text-sm font-medium'>
              Message
            </label>
            <Input
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter a message to echo'
            />
          </div>

          <Button onClick={handleEcho} disabled={echoMutation.isPending} className='w-full'>
            {echoMutation.isPending ? 'Sending...' : 'Send Echo Request'}
          </Button>

          {echoMutation.isError && (
            <div className='p-4 bg-destructive/10 text-destructive rounded-md'>
              <p className='font-semibold'>Error:</p>
              <p className='text-sm'>{echoMutation.error.message}</p>
            </div>
          )}

          {echoMutation.isSuccess && (
            <div className='p-4 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 rounded-md'>
              <p className='font-semibold'>Response:</p>
              <pre className='text-sm mt-1 overflow-auto'>
                {JSON.stringify(echoMutation.data, null, 2)}
              </pre>
            </div>
          )}

          <div className='pt-4 border-t'>
            <h3 className='text-sm font-semibold mb-2'>Mutation Status:</h3>
            <ul className='text-sm space-y-1'>
              <li>isPending: {echoMutation.isPending.toString()}</li>
              <li>isIdle: {echoMutation.isIdle.toString()}</li>
              <li>isError: {echoMutation.isError.toString()}</li>
              <li>isSuccess: {echoMutation.isSuccess.toString()}</li>
            </ul>
            <p className='text-xs text-muted-foreground mt-2'>
              Note: useMutation only has isPending (no isLoading or isFetching)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
