"use client";
import React, { useRef } from "react";

import { EditorContent } from "@tiptap/react";
import { LinkMenu } from "@/components/workspace/editor/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";

import "@/styles/index.css";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
// import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { Input } from "@/components/ui/input";

// import * as Y from "yjs";
// import { TiptapCollabProvider } from "@hocuspocus/provider";

export const BlockEditor = ({
  // ydoc,
  // provider,
  params,
  // user,
  onSave,
  documentData,
}: {
  onSave: (content: string) => void;
  // user?: any;
  documentData: string;
  isLoading: boolean;
  params: string;
  // hasCollab: boolean;
  // ydoc: Y.Doc;
  // provider?: TiptapCollabProvider | null | undefined;
}) => {

   const menuContainerRef = useRef<HTMLDivElement>(null);

  // const { editor, users, collabState, saveContent } = useBlockEditor({
  //   ydoc,
  //   provider,
  //   user,
  //   onSave,
  //   initialContent: documentData,
  // });

  const { editor, saveContent } = useBlockEditor({
    onSave,
    initialContent: documentData,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full pt-14">
        {/* <EditorHeader
          editor={editor}
          saveContent={saveContent}
          // collabState={collabState}
          // users={users}
        /> */}
        <Input className="tiptap !text-[50px] container w-full !border-none focus-visible:ring-0 h-20 !bg-transparent" placeholder="New Note"/>
        <EditorContent
          editor={editor}
          className="flex-1 overflow-y-auto h-[calc(100vh-66px)] container pt-5 focus:border-none focus-visible:ring-0 !bg-transparent"
        />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
