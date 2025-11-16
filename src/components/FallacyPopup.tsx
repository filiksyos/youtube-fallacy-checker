import React from 'react';
import { Fallacy } from '../types';
import './FallacyPopup.scss';

interface FallacyPopupProps {
  fallacy: Fallacy;
  onClose: () => void;
}

export const FallacyPopup: React.FC<FallacyPopupProps> = ({ fallacy, onClose }) => {
  return (
    <div className="fallacy-popup">
      <div className="fallacy-popup__content">
        <button className="fallacy-popup__close" onClick={onClose}>
          ✕
        </button>
        <div className="fallacy-popup__header">
          <span className="fallacy-popup__icon">⚠️</span>
          <h3 className="fallacy-popup__title">Logical Fallacy Detected</h3>
        </div>
        <div className="fallacy-popup__body">
          <div className="fallacy-popup__type">
            <strong>Type:</strong> {fallacy.type}
          </div>
          <div className="fallacy-popup__explanation">
            <strong>Explanation:</strong> {fallacy.explanation}
          </div>
          {fallacy.context && (
            <div className="fallacy-popup__context">
              <strong>Context:</strong> "{fallacy.context}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};