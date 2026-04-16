import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Highlighter, Quote,
  Image as ImageIcon, Code, Plus, Link as LinkIcon
} from 'lucide-react';
import styles from './MediumEditor.module.css';
import { useSnackbar } from 'notistack';
import Spinner from './spinner';

export default function MediumEditor({ onChange }) {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your article...',
      }),
      ImageExtension,
      Highlight,
      LinkExtension.configure({
        openOnClick: false,
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Remove empty paragraphs for exact blank state
      const cleanedHtml = html === '<p></p>' ? '' : html;
      if (onChange) {
        onChange(cleanedHtml);
      }
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar('Image size should be less than 10MB', { variant: 'error' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result;
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, fileName: file.name }),
        });

        const data = await response.json();

        if (data.success) {
          editor.chain().focus().setImage({ src: data.url }).run();
          enqueueSnackbar('Image injected successfully!', { variant: 'success' });
        } else {
          enqueueSnackbar(data.error || 'Failed to upload image', { variant: 'error' });
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Failed to upload image', { variant: 'error' });
      } finally {
        setIsUploading(false);
        setIsFloatingOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLink = useCallback(() => {
    const url = window.prompt('URL');
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor || !mounted) {
    return null;
  }

  return (
    <div className={styles.editorWrapper}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className={styles.bubbleMenu}>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleBold().run(); }}
          className={editor.isActive('bold') ? styles.isActive : ''}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleItalic().run(); }}
          className={editor.isActive('italic') ? styles.isActive : ''}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          className={editor.isActive('link') ? styles.isActive : ''}
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleHighlight().run(); }}
          className={editor.isActive('highlight') ? styles.isActive : ''}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleBlockquote().run(); }}
          className={editor.isActive('blockquote') ? styles.isActive : ''}
          title="Quote"
        >
          <Quote size={16} />
        </button>

        <div className={styles.separator} />

        <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleHeading({ level: 3 }).run(); }} className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}>H3</button>
      </BubbleMenu>}

      {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100, placement: 'left' }}>
        <div className={styles.floatingMenu}>
          <button
            type="button"
            className={`${styles.plusButton} ${isFloatingOpen ? styles.isOpen : ''}`}
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
          >
            <Plus size={20} />
          </button>

          {isFloatingOpen && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => fileInputRef.current?.click()}
                title="Add Image"
                disabled={isUploading}
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                  setIsFloatingOpen(false);
                }}
                title="Add Code Block"
              >
                <Code size={18} />
              </button>
            </div>
          )}
        </div>
      </FloatingMenu>}

      <div className={styles.editorContainer}>
        {isUploading && (
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10
          }}>
            <div style={{ filter: 'invert(0.5)', transform: 'scale(1.5)' }}>
              <Spinner />
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
