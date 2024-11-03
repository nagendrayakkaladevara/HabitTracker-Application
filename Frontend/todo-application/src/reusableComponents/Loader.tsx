import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import React from 'react';

interface LoaderProps {
    isLoadingOpen: boolean
}

const Loader: React.FC<LoaderProps> = ({ isLoadingOpen }) => {


    return (
        <AlertDialog open={isLoadingOpen}>
            <AlertDialogContent className='border-none' style={{ background: "none" }}>
                <div className='w-full flex justify-center items-center'>
                    <div className="loader"></div>
                </div>
            </AlertDialogContent>
        </AlertDialog>

    );
};

export default Loader;