'use client'

import { useEffect, useState} from "react";
import ProductResume  from "@/components/ui/shop/product-resume";
import useProduct from "@/hooks/useProduct";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";
  import { LuEye } from "react-icons/lu";

export default function ProductPopup({ productId, isIcon }: { productId: number, isIcon?: boolean }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure(); 
    const [product, setProduct] = useState<any>(null);
    const { fetchProduct } = useProduct();

    const handleOpen = async () => {
        const product = await fetchProduct(productId, 'DATABASE_ID');
        setProduct(product);
        onOpen();
    }

    return (
        <>
        <Button onPress={handleOpen} radius='full' isIconOnly={isIcon}>
            {
                isIcon ? (
                    <LuEye className="w-5 h-5" />
                ) : (
                    'Ver'
                )
            }
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-screen py-24 bg-[#041E2C] text-white">
          <ModalContent>
            {(onClose) => (
              <>
                  <ProductResume product={product} classNames={{container: 'p-4'}}/>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
}