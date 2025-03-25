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
import { useState } from "react";

interface AddEmmitionProps {
  confirm: (tabName: string) => void;
}

const AddEmmition: React.FC<AddEmmitionProps> = ({ confirm }) => {
  const dialog = useDialog();
  let registrationNumber = "";
  let industryType = "";
  let emmitionName = "";

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
                    id="registrationNumber"
                    name="registrationNumber"
                    type="string"
                    placeholder="법인 등록 번호"
                    _placeholder={{ color: "skyblue" }}
                    onChange={(e) => (registrationNumber = e.target.value)}
                  />
                </Box>
                <Box m={2}>
                  <Input
                    id="industryType"
                    name="industryType"
                    type="string"
                    placeholder="업종"
                    _placeholder={{ color: "skyblue" }}
                    onChange={(e) => (industryType = e.target.value)}
                  />
                </Box>
                <Box m={2}>
                  <Input
                    id="emmitionName"
                    name="emmitionName"
                    type="string"
                    placeholder="사업장 명"
                    _placeholder={{ color: "skyblue" }}
                    onChange={(e) => (emmitionName = e.target.value)}
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
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      confirm(emmitionName);
                    }}
                    m={2}
                  >
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
