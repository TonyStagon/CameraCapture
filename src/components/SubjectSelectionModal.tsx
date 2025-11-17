// src/components/SubjectSelectionModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS } from '../utils/constants';

interface SubjectSelectionModalProps {
  visible: boolean;
  onSelectSubject: (subject: string) => void;
  onClose: () => void;
}

const SUBJECTS = [
  'Math',
  'Biology',
  'Physics',
  'Chemistry',
  'History',
  'Geography',
  'English',
  'Computer Science',
  'Economics',
  'Literature',
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({
  visible,
  onSelectSubject,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />
          
          <Text style={styles.title}>What is the question{'\n'}related to?</Text>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {SUBJECTS.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subjectButton}
                onPress={() => onSelectSubject(subject)}
                activeOpacity={0.7}
              >
                <Text style={styles.subjectText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#C4C4C4',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});