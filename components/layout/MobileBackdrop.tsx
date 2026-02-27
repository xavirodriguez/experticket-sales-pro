
import React from 'react';

interface MobileBackdropProps {
  onClick: () => void;
}

const MobileBackdrop: React.FC<MobileBackdropProps> = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
    onClick={onClick}
  />
);

export default MobileBackdrop;
