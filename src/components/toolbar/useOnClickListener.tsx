import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState, useCallback } from 'react';
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { eventTypes } from './ToolBar.icon';

const LowPriority = 1;

export const useOnClickListener = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    let allSelectedEvents = [...selectedEventTypes];

    // inner function

    const pushInEventTypesState = (selectionFormat: any, event: any) => {
      if (selectionFormat) {
        if (selectedEventTypes.includes(event as never)) return;
        else allSelectedEvents.push(event as never);
      } else {
        allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
      }
    };

    // range selection ( e.g like to bold only the particular area of the text)
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          setBlockType(type);
        }
      }

      pushInEventTypesState(selection.hasFormat('bold'), eventTypes.formatBold);
      pushInEventTypesState(selection.hasFormat('italic'), eventTypes.formatItalic);
      pushInEventTypesState(
        selection.hasFormat('underline'),
        eventTypes.formatUnderline
      );
      pushInEventTypesState(
        selection.hasFormat('strikethrough'),
        eventTypes.formatStrike
      );
      pushInEventTypesState(selection.hasFormat('code'), eventTypes.formatCode);

      setSelectedEventTypes(allSelectedEvents);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const onClick = (event: any) => {
    if (event === eventTypes.formatBold) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    } else if (event === eventTypes.formatItalic) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    } else if (event === eventTypes.formatUnderline) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    } else if (event === eventTypes.formatAlignLeft) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    } else if (event === eventTypes.formatAlignCenter) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    } else if (event === eventTypes.formatAlignRight) {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    } else if (event === eventTypes.formatCode) {
      formatCode();
    } else if (event === eventTypes.formatRedo) {
      editor.dispatchCommand(REDO_COMMAND, undefined);
    } else if (event === eventTypes.formatUndo) {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
    }
  };

  return { onClick };
};

// TODO --------------------------------------

// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   REDO_COMMAND,
//   UNDO_COMMAND,
//   SELECTION_CHANGE_COMMAND,
//   FORMAT_TEXT_COMMAND,
//   FORMAT_ELEMENT_COMMAND,
//   $getSelection,
//   $isRangeSelection,
//   $createParagraphNode,
// } from 'lexical';
// import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
// import {
//   INSERT_ORDERED_LIST_COMMAND,
//   INSERT_UNORDERED_LIST_COMMAND,
//   REMOVE_LIST_COMMAND,
//   $isListNode,
//   ListNode,
// } from '@lexical/list';
// import {
//   $isHeadingNode,
//   $createHeadingNode,
//   $createQuoteNode,
// } from '@lexical/rich-text';
// import { $isLinkNode } from '@lexical/link';
// import { $wrapNodes, $isAtNodeEnd } from '@lexical/selection';
// import { eventTypes } from './ToolBar.icon';

// const LowPriority = 1;

// export const useOnClickListener = () => {
//   const [editor] = useLexicalComposerContext();
//   const [blockType, setBlockType] = useState('paragraph');
//   const [selectedEventTypes, setSelectedEventTypes] = useState([]);
//   const [isLink, setIsLink] = useState(false);
//   console.log({ isLink });
//   const updateToolbar = useCallback(() => {
//     const selection = $getSelection();
//     let allSelectedEvents = [...selectedEventTypes];

//     // inner function

//     const pushInEventTypesState = (selectionFormat: any, event: any) => {
//       if (selectionFormat) {
//         if (selectedEventTypes.includes(event as never)) return;
//         else allSelectedEvents.push(event as never);
//       } else {
//         allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
//       }
//     };

//     // range selection ( e.g like to bold only the particular area of the text)
//     if ($isRangeSelection(selection)) {
//       const anchorNode = selection.anchor.getNode();
//       const element =
//         anchorNode.getKey() === 'root'
//           ? anchorNode
//           : anchorNode.getTopLevelElementOrThrow();
//       const elementKey = element.getKey();
//       const elementDOM = editor.getElementByKey(elementKey);
//       if (elementDOM !== null) {
//         if ($isListNode(element)) {
//           const parentList = $getNearestNodeOfType(anchorNode, ListNode);
//           const type = parentList ? parentList.getTag() : element.getTag();
//           setBlockType(type);
//         } else {
//           const type = $isHeadingNode(element)
//             ? element.getTag()
//             : element.getType();

//           setBlockType(type);
//         }
//       }

//       pushInEventTypesState(selection.hasFormat('bold'), eventTypes.formatBold);
//       pushInEventTypesState(selection.hasFormat('italic'), eventTypes.formatItalic);
//       pushInEventTypesState(
//         selection.hasFormat('underline'),
//         eventTypes.formatUnderline
//       );
//       pushInEventTypesState(
//         selection.hasFormat('strikethrough'),
//         eventTypes.formatStrike
//       );
//       pushInEventTypesState(selection.hasFormat('code'), eventTypes.formatCode);

//       // Update links
//       const node = getSelectedNode(selection);
//       const parent = node.getParent();
//       if ($isLinkNode(parent) || $isLinkNode(node)) {
//         if (!allSelectedEvents.includes(eventTypes.formatInsertLink as never))
//           allSelectedEvents.push(eventTypes.formatInsertLink as never);
//         setIsLink(true);
//       } else {
//         if (allSelectedEvents.includes(eventTypes.formatInsertLink as never)) {
//           allSelectedEvents = allSelectedEvents.filter(
//             (ev) => ev !== eventTypes.formatCode
//           );
//         }
//         setIsLink(false);
//       }

//       setSelectedEventTypes(allSelectedEvents);
//     }
//   }, [editor]);

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerUpdateListener(({ editorState }) => {
//         editorState.read(() => {
//           updateToolbar();
//         });
//       }),
//       editor.registerCommand(
//         SELECTION_CHANGE_COMMAND,
//         () => {
//           updateToolbar();
//           return false;
//         },
//         LowPriority
//       )
//     );
//   }, [editor, updateToolbar]);

//   const onClick = (event: any) => {
//     if (event === eventTypes.formatBold) {
//       editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
//     } else if (event === eventTypes.formatItalic) {
//       editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
//     } else if (event === eventTypes.formatUnderline) {
//       editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
//     } else if (event === eventTypes.formatAlignLeft) {
//       editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
//     } else if (event === eventTypes.formatAlignCenter) {
//       editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
//     } else if (event === eventTypes.formatAlignRight) {
//       editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
//     } else if (event === eventTypes.paragraph) {
//       formatParagraph();
//     } else if (event === eventTypes.h1) {
//       formatHeading('h1');
//     } else if (event === eventTypes.h2) {
//       formatHeading('h2');
//     } else if (event === eventTypes.ol) {
//       console.log('orderlest ');
//       formatNumberedList();
//     } else if (event === eventTypes.ul) {
//       formatBulletList();
//     } else if (event === eventTypes.quote) {
//       formatQuote();
//     } else if (event === eventTypes.formatCode) {
//       formatCode();
//     } else if (event === eventTypes.formatRedo) {
//       editor.dispatchCommand(REDO_COMMAND, undefined);
//     } else if (event === eventTypes.formatUndo) {
//       editor.dispatchCommand(UNDO_COMMAND, undefined);
//     }
//   };

//   const formatParagraph = () => {
//     if (blockType !== 'paragraph') {
//       editor.update(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//           $wrapNodes(selection, () => $createParagraphNode());
//         }
//       });
//     }
//   };

//   const formatHeading = (val: any) => {
//     if (blockType !== val) {
//       editor.update(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//           $wrapNodes(selection, () => $createHeadingNode(val));
//         }
//       });
//     }
//   };

//   const formatBulletList = () => {
//     if (blockType !== 'ul') {
//       editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
//     } else {
//       editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
//     }
//   };

//   const formatNumberedList = () => {
//     if (blockType !== 'ol') {
//       editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
//     } else {
//       editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
//     }
//   };

//   const formatQuote = () => {
//     if (blockType !== 'quote') {
//       editor.update(() => {
//         const selection = $getSelection();

//         if ($isRangeSelection(selection)) {
//           $wrapNodes(selection, () => $createQuoteNode());
//         }
//       });
//     }
//   };

//   const formatCode = () => {
//     if (blockType !== 'code') {
//       editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
//       // below code insert the new block but we only need to format the specific part of the text into code format
//       //   editor.update(() => {
//       //     const selection = $getSelection();

//       //     if ($isRangeSelection(selection)) {
//       //       $wrapNodes(selection, () => $createCodeNode());
//       //     }
//       //   });
//     }
//   };

//   return { onClick };
// };

// function getSelectedNode(selection: any) {
//   const anchor = selection.anchor;
//   const focus = selection.focus;
//   const anchorNode = selection.anchor.getNode();
//   const focusNode = selection.focus.getNode();
//   if (anchorNode === focusNode) {
//     return anchorNode;
//   }
//   const isBackward = selection.isBackward();
//   if (isBackward) {
//     return $isAtNodeEnd(focus) ? anchorNode : focusNode;
//   } else {
//     return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
//   }
// }
