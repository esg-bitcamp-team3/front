import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
  useDialog,
} from "@chakra-ui/react";
import { FileUpload } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { ISubsidiary } from "@/lib/api/interfaces/retrieveInterfaces";
import { createSubsidiary } from "@/lib/api/post";
import { toaster } from "@/components/ui/toaster";

const AddEmmition = () => {
  const dialog = useDialog();
  const { register, handleSubmit } = useForm<ISubsidiary>({
    defaultValues: { organization: "67e2270b5a8ed00799f03758" },
  });
  const onSubmit = async (data: ISubsidiary) => {
    const response = await createSubsidiary(data);
    // toaster.promise(response, {
    //   success: {
    //     title: "Successfully uploaded!",
    //     description: "Looks great",
    //   },
    //   error: {
    //     title: "Upload failed",
    //     description: "Something wrong with the upload",
    //   },
    //   loading: { title: "Uploading...", description: "Please wait" },
    // });
  };

  return (
    <form>
      <Dialog.RootProvider value={dialog} size={"lg"}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="xl">
            추가 하기
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title display="flex" flexDirection="column" p={4}>
                  사업장 추가
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box m={2}>
                  <Input
                    display="flex"
                    type="string"
                    placeholder="법인 등록 번호"
                    _placeholder={{ color: "skyblue" }}
                    {...register("registrationNumber", {
                      required: "This is required",
                    })}
                  />
                </Box>
                <Box m={2}>
                  <Input
                    type="string"
                    placeholder="업종"
                    _placeholder={{ color: "skyblue" }}
                    {...register("industryType", {
                      required: "This is required",
                    })}
                  />
                </Box>
                <Box m={2}>
                  <Input
                    type="string"
                    placeholder="사업장 명"
                    _placeholder={{ color: "skyblue" }}
                    {...register("name", {
                      required: "This is required",
                    })}
                  />
                </Box>
                <FileUpload.Root accept={["image/png"]}>
                  <FileUpload.HiddenInput />
                  <FileUpload.Trigger asChild>
                    <Button variant="outline" size="sm">
                      <HiUpload /> Upload file
                    </Button>
                  </FileUpload.Trigger>
                  <FileUpload.List />
                </FileUpload.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" m={2}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button onClick={handleSubmit(onSubmit())} m={2}>
                    Save
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </form>
  );
};

export default AddEmmition;
