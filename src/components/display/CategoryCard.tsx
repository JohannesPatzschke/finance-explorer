import React, { useRef, useCallback } from 'react';
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Box,
  Checkbox,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  HStack,
  FormControl,
  FormErrorMessage,
  CloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import { CategoryType, GroupType } from '@models/Category';
import { generateID } from '@utils/indexing';

type GroupSectionProps = {
  group: GroupType;
  index: number;
  form: UseFormReturn<CategoryType>;
  onRemove: (group: GroupType, index: number) => void;
  removeDisabled?: boolean;
};

const GroupSection = ({ group, index, form, onRemove, removeDisabled }: GroupSectionProps) => {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${index}.expressions`,
    rules: { minLength: 1 },
  });

  const appendExpression = useCallback(() => {
    append({ id: generateID(), value: '', isRegExp: false });
  }, [append]);

  const handleRemove = useCallback(() => onRemove(group, index), [onRemove, group, index]);

  const menuGroupRegister = useCallback(
    (...props: Parameters<typeof register>) => {
      // Removing ref as it does not work with MenuOptionGroup
      const { ref, ...registration } = register(...props);

      const [name] = props;

      return {
        ...registration,
        onChange: async (values: string | Array<string>) =>
          registration.onChange({
            target: { name, value: typeof values === 'string' ? values : values.sort().join('') },
            type: 'change',
          }),
      };
    },
    [register],
  );

  return (
    <ListItem key={group.id} pl={8}>
      <HStack>
        <FormControl isInvalid={!!errors.groups?.[index]?.name} maxWidth={570}>
          <Input
            variant="filled"
            placeholder="Group Name"
            {...register(`groups.${index}.name`, {
              required: 'This is required',
            })}
          />
          {errors.groups?.[index]?.name && (
            <FormErrorMessage>{errors.groups?.[index]?.name?.message}</FormErrorMessage>
          )}
        </FormControl>
        <CloseButton onClick={handleRemove} isDisabled={removeDisabled} />
      </HStack>
      <br />
      {fields.map((expression, expressionIndex) => (
        <HStack ml={8} key={expression.id} my={2} maxWidth={450} spacing={10}>
          <HStack>
            <FormControl
              isInvalid={!!errors.groups?.[index]?.expressions?.[expressionIndex]?.value}
            >
              <InputGroup size="sm" minWidth={250}>
                {watch(`groups.${index}.expressions.${expressionIndex}.isRegExp`) && (
                  <InputLeftAddon children="/" />
                )}
                <Input
                  placeholder="Regular expression"
                  {...register(`groups.${index}.expressions.${expressionIndex}.value`, {
                    required: 'This is required',
                  })}
                />
                {watch(`groups.${index}.expressions.${expressionIndex}.isRegExp`) && (
                  <InputRightAddon
                    p={0}
                    children={
                      <Menu closeOnSelect={false}>
                        <MenuButton as={Button} size="sm" variant="ghost">
                          /{watch(`groups.${index}.expressions.${expressionIndex}.flags`) ?? ''}
                        </MenuButton>
                        <MenuList minWidth="240px">
                          <MenuOptionGroup
                            type="checkbox"
                            defaultValue={(
                              watch(`groups.${index}.expressions.${expressionIndex}.flags`) ?? ''
                            ).split('')}
                            {...menuGroupRegister(
                              `groups.${index}.expressions.${expressionIndex}.flags`,
                            )}
                          >
                            <MenuItemOption value="g">
                              <b>g</b>lobal
                            </MenuItemOption>
                            <MenuItemOption value="i">
                              <b>i</b>sensitive
                            </MenuItemOption>
                            <MenuItemOption value="m">
                              <b>m</b>ulti line
                            </MenuItemOption>
                          </MenuOptionGroup>
                        </MenuList>
                      </Menu>
                    }
                  />
                )}
              </InputGroup>
              {errors.groups?.[index]?.expressions?.[expressionIndex]?.value && (
                <FormErrorMessage>
                  {errors.groups?.[index]?.expressions?.[expressionIndex]?.value?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <Checkbox
              size="sm"
              {...register(`groups.${index}.expressions.${expressionIndex}.isRegExp`)}
            >
              RegExp
            </Checkbox>
          </HStack>

          <CloseButton onClick={() => remove(expressionIndex)} isDisabled={fields.length <= 1} />
        </HStack>
      ))}
      <Button size="xs" colorScheme="teal" variant="ghost" ml={8} onClick={appendExpression}>
        Add Expression
      </Button>
    </ListItem>
  );
};

type CategoryCardProps = {
  category?: CategoryType;
  onRemove(categoryId: string): void;
  onSave(category: CategoryType): void;
};

const CategoryCard = ({ category, onRemove, onSave }: CategoryCardProps) => {
  const form = useForm<CategoryType>({ defaultValues: category });
  const toast = useToast();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
    rules: { minLength: 1 },
  });

  const appendGroup = useCallback(() => {
    append({
      id: generateID(),
      name: '',
      expressions: [{ id: generateID(), value: '', isRegExp: false }],
    });
  }, [append]);

  const removeGroup = useCallback(
    (group: GroupType, index: number) => {
      remove(index);
    },
    [remove],
  );

  const handleRemove = useCallback(() => {
    if (category?.id) {
      onRemove(category?.id);
    }
  }, [category?.id]);

  function onSubmit(values: CategoryType) {
    onSave(values);
    reset({}, { keepValues: true });
    toast({
      title: `Category "${values.name}" saved.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="outline">
        <Accordion allowToggle={true}>
          <AccordionItem border={0}>
            {({ isExpanded }) => (
              <>
                <CardHeader p={isExpanded ? 4 : 1}>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <FormControl isInvalid={!!errors.name} maxWidth={600}>
                        <Input
                          variant="filled"
                          placeholder="Name"
                          isReadOnly={!isExpanded}
                          {...register(`name`, {
                            required: 'This is required',
                          })}
                        />
                        {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
                      </FormControl>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </CardHeader>

                <AccordionPanel>
                  <CardBody>
                    <List spacing={5}>
                      {fields?.map((group, groupIndex) => (
                        <GroupSection
                          key={group.id}
                          group={group}
                          index={groupIndex}
                          form={form}
                          removeDisabled={fields.length <= 1}
                          onRemove={removeGroup}
                        />
                      ))}
                    </List>
                    <br />
                    <Button
                      size="xs"
                      colorScheme="teal"
                      variant="ghost"
                      ml={8}
                      onClick={appendGroup}
                    >
                      Add Group
                    </Button>
                  </CardBody>
                  <CardFooter justify="end">
                    <ButtonGroup spacing={5}>
                      <Button size="sm" colorScheme="red" variant="outline" onClick={handleRemove}>
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        variant="solid"
                        type="submit"
                        isDisabled={!isDirty}
                      >
                        Save
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Card>
    </form>
  );
};

export default CategoryCard;
