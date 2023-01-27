import React, { useRef, useCallback } from 'react';
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Box,
  Checkbox,
  List,
  ListItem,
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
  Heading,
} from '@chakra-ui/react';
import { CategoryType, GroupType } from '../../models/Category';
import { generateID } from '../../utils/indexing';

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
              <Input
                placeholder="Regular expression"
                {...register(`groups.${index}.expressions.${expressionIndex}.value`, {
                  required: 'This is required',
                })}
              />
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
  onSave(category: CategoryType): void;
};

const CategoryCard = ({ category, onSave }: CategoryCardProps) => {
  const form = useForm<CategoryType>({ defaultValues: category });
  const {
    control,
    handleSubmit,
    register,
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

  function onSubmit(values: CategoryType) {
    onSave(values);
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
                      <Button size="sm" colorScheme="red" variant="outline" type="submit">
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
