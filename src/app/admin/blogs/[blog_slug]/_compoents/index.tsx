"use client";

// import { TiptapCollabProvider } from "@hocuspocus/provider";
// import { useSearchParams } from "next/navigation";
import {
    useState,
} from "react";
// import { Doc as YDoc } from "yjs";
// import { useAuthUser } from "@/hooks/use-auth-user";
import { BlockEditor } from "@/components/workspace/editor/BlockEditor";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   useGetFileListQuery,
//   useUpdateFileMutation,
// } from "@/lib/store/Service/User_Auth_Api";


export default function Document({
    params,
}: {
    params: string;
}) {
    // const { token, user } = useAuthUser();
    // const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
    // const [collabToken, setCollabToken] = useState<string | null | undefined>();
    // const searchParams = useSearchParams();

    //   const { data, refetch, isLoading } = useGetFileListQuery(
    //     {
    //       accessToken: token,
    //       slug: params.file_slug,
    //     },
    //     { skip: !params.file_slug && !token }
    //   );
    //   const [updateFile, { isLoading: isLoadingUpdate }] = useUpdateFileMutation();

    const [documentData, _setDocumentData] = useState<string>("");

    // const hasCollab =
    //     parseInt(searchParams?.get("noCollab") as string) !== 1 &&
    //     collabToken !== null;

    // useEffect(() => {
    //     const dataFetch = async () => {
    //         try {
    //             const response = await fetch("/api/collaboration", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error(
    //                     "No collaboration token provided, please set TIPTAP_COLLAB_SECRET in your environment"
    //                 );
    //             }
    //             const data = await response.json();
    //             const { token } = data;
    //             setCollabToken(token);
    //         } catch (e) {
    //             if (e instanceof Error) {
    //                 console.error(e.message);
    //             }
    //             setCollabToken(null);
    //             return;
    //         }
    //     };

    //     dataFetch();
    // }, []);

    // const ydoc = useMemo(() => new YDoc(), []);

    //   useEffect(() => {
    //     if (data) {
    //       setDocumentData(data?.document);
    //     }
    //   }, [data]);

    //   const onSave = async (content: string) => {
    //     try {
    //       const payload = {
    //         document: JSON.stringify(content),
    //       };
    //       await updateFile({ slug: params, data: payload, accessToken: token });
    //     } catch (error) {
    //       console.error("Failed to save content:", error);
    //     }
    //   };

    // useLayoutEffect(() => {
    //     if (hasCollab && collabToken) {
    //         setProvider(
    //             new TiptapCollabProvider({
    //                 name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${file_slug}`,
    //                 appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? "",
    //                 token: collabToken,
    //                 document: ydoc,
    //             })
    //         );
    //     }
    // }, [setProvider, collabToken, ydoc, file_slug, hasCollab]);

    // if ((hasCollab && !provider) || collabToken === undefined) return;

    return (

        <BlockEditor
            isLoading={false}
            params={params}
            onSave={() => console.log("save")}
            documentData={documentData}
        // hasCollab={hasCollab}
        // ydoc={ydoc}
        // provider={provider}
        // user={user}
        />

    );
}
